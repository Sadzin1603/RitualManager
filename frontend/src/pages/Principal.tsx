import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { jwtDecode } from 'jwt-decode'
import { useState } from "react";
import "./Principal.css";
import MiniCard from "../components/MiniCard";
import{useQuery} from '@tanstack/react-query'
import Filtro from '../components/Filtro'


type ViewMode = "mini" | "card" | "lista";

function Principal() {
    const navigate = useNavigate();
    //─────────────────────────────────────────────────────────────────────────
    //PEGAR RITUAIS
    const token = localStorage.getItem("token");
    const userId = token ? (jwtDecode(token) as any)?.id : null;

    const {data:rituais} = useQuery({
        queryKey: ['rituais_aprovados'],
        queryFn: fetchDataRituais,
    })
    async function fetchDataRituais() {
            const res = await fetch("http://localhost:3000/ritual");
            if (!res.ok) {
                throw new Error("Erro ao buscar rituais");
            }

            return await res.json();
            
    }
    const {data:meus_rituais} = useQuery({
        queryKey: ['meus_rituais'],
        queryFn: fetchDataMyRituais,
    })
    async function fetchDataMyRituais() {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/user/${userId}/rituais`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return await res.json(); 
    }
    // ─────────────────────────────────────────────────────────────────────────
    //Configurar Filtro
    const [viewMode, setViewMode] = useState<ViewMode>(localStorage.getItem('ListMode') || 'card');
    const [rituaisFiltrados,setRituaisFiltrados] = useState([])
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="title w-auto min-h-screen flex justify-around p-8 gap-3">

            <div className="div_Lateral">
                {/* Filtros */}
                <Filtro 
                    rituais={rituais}
                    setRituaisFiltrados={setRituaisFiltrados}
                    viewMode={viewMode}
                    setViewMode={setViewMode}

                />
            </div>

            <div className="flex flex-col items-center gap-4 flex-1 w-full">
                {viewMode === "lista" ? (
                    <div className="flex flex-col gap-3 w-full max-w-4xl">
                        {rituaisFiltrados?.map((ritual: any) => (
                            <Card
                                key={ritual.id}
                                ritual={ritual}
                                viewMode="lista"
                            />
                        ))}
                    </div>
                ) : viewMode === "mini" ? (
                    <div className="grid grid-cols-2 gap-4 w-[670px]">
                        {rituaisFiltrados?.map((ritual: any) => (
                            <Card
                                key={ritual.id}
                                ritual={ritual}
                                viewMode="mini"
                            />
                        ))}
                    </div>
                ) : (
                    Array.from({ length: Math.ceil(rituaisFiltrados?.length / 3) }, (_, rowIndex) => {
                        const rowItems = rituaisFiltrados.slice(rowIndex * 3, rowIndex * 3 + 3);
                        return (
                            <div className="flex gap-4 justify-center" key={rowIndex}>
                                {rowItems.map((ritual: any) => (
                                    <Card
                                        key={ritual.id}
                                        ritual={ritual}
                                        viewMode="card"
                                    />
                                ))}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="div_Lateral space-y-5">
                <div className="div_criar_ritual">
                    <button
                        className="criar_ritual"
                        onClick={() => navigate("/profile")}
                    >
                        Meu Perfil
                    </button>
                    <button
                        className="criar_ritual"
                        onClick={() => navigate("/rituais")}
                    >
                        + Criar Ritual
                    </button>
                </div>
                <div>
                    {meus_rituais?.map((ritual: any) => (
                        <MiniCard key={ritual.id} ritual={ritual} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Principal;