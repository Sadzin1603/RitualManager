import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import MiniCard from "../components/MiniCard";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import "./Principal.css";
import { useQuery } from '@tanstack/react-query'
import Filtro from "../components/Filtro";
import { Loader } from "../components/Loader";

type ViewMode = "mini" | "card" | "lista";

function Profile() {
    const navigate = useNavigate();
    //PEGAR RITUAIS
    const { data: rituais, isLoading: isLoadingRituais } = useQuery({
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

    const { data: meus_rituais, isLoading: isLoadingMeus } = useQuery({
        queryKey: ['meus_rituais'],
        queryFn: fetchDataMyRituais,
    })
    async function fetchDataMyRituais() {
        const token = localStorage.getItem("token") || '';
        const res = await fetch(`http://localhost:3000/user/${(jwtDecode(token) as any).id}/rituais`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await res.json();
    }
    //─────────────────────────────────────────────────────────────────────────
    //Configurar Filtro
    const [viewMode, setViewMode] = useState<ViewMode>(localStorage.getItem('ListMode') as ViewMode || 'card');
    const [rituaisDoUsuarioFiltrados, setRituaisFiltrados] = useState([])
    //─────────────────────────────────────────────────────────────────────────

    return (
        <div className="title w-auto min-h-screen flex justify-around p-8 gap-3">

            {/* Coluna lateral esquerda — filtros */}
            <div className="div_Lateral">
                <Filtro
                    rituais={meus_rituais}
                    setRituaisFiltrados={setRituaisFiltrados}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            </div>

            {/* Centro — rituais do usuário com viewMode */}
            <div className="flex flex-col items-center gap-4 flex-1 w-full">
                {isLoadingMeus ? (
                    <div className="flex items-center justify-center w-full min-h-[400px]">
                        <Loader loading={true} size={500} />
                    </div>
                ) : viewMode === "lista" ? (
                    <div className="flex flex-col gap-3 w-full max-w-4xl">
                        {rituaisDoUsuarioFiltrados.map((ritual: any) => (
                            <Card
                                key={ritual.id}
                                ritual={ritual}
                                viewMode="lista"
                            />
                        ))}
                    </div>
                ) : viewMode === "mini" ? (
                    <div className="grid grid-cols-2 gap-4 w-[670px]">
                        {rituaisDoUsuarioFiltrados?.map((ritual: any) => (
                            <Card
                                key={ritual.id}
                                ritual={ritual}
                                viewMode="mini"
                            />
                        ))}
                    </div>
                ) : (
                    Array.from({ length: Math.ceil(rituaisDoUsuarioFiltrados?.length / 3) }, (_, rowIndex) => {
                        const rowItems = rituaisDoUsuarioFiltrados.slice(rowIndex * 3, rowIndex * 3 + 3);
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

            {/* Coluna lateral direita — minicards aprovados + botões */}
            <div className="div_Lateral space-y-5">
                <div className="div_criar_ritual">
                    <button className="criar_ritual" onClick={() => navigate("/principal")}>Voltar</button>
                    <button className="criar_ritual" onClick={() => navigate("/rituais")}>+ Criar Ritual</button>
                </div>
                <div>
                    {isLoadingRituais ? (
                        <div className="flex items-center justify-center w-full min-h-[200px]">
                            <Loader loading={true} size={150} />
                        </div>
                    ) : (
                        rituais?.map((ritual: any) => (
                            <MiniCard key={ritual.id} ritual={ritual} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;