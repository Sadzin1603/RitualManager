import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { jwtDecode } from 'jwt-decode'
import { useState } from "react";
import "./Principal.css";
import MiniCard from "../components/MiniCard";
import { useQuery } from '@tanstack/react-query'
import Filtro from '../components/Filtro'
import { Loader } from "../components/Loader";

type ViewMode = "mini" | "card" | "lista";

function Principal() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userId = token ? (jwtDecode(token) as any)?.id : null;

    const { data: rituais, isLoading } = useQuery({
        queryKey: ['rituais_aprovados'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ritual`);
            if (!res.ok) throw new Error("Erro ao buscar rituais");
            return res.json();
        }
    })

    const { data: meus_rituais, isLoading: isLoadingMeus } = useQuery({
        queryKey: ['meus_rituais'],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}/rituais`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.json();
        }
    })

    const [viewMode, setViewMode] = useState<ViewMode>(localStorage.getItem('ListMode') as ViewMode || 'card');
    const [rituaisFiltrados, setRituaisFiltrados] = useState([]);
    const [filtroAberto, setFiltroAberto] = useState(false);

    const filtroProps = { rituais, setRituaisFiltrados, viewMode, setViewMode };

    return (
        <div className="title w-auto min-h-screen flex justify-around items-start p-8 gap-3">

            {/* Coluna lateral esquerda — oculta no mobile via CSS */}
            <div className="div_Lateral div_Lateral--filtro">
                <Filtro {...filtroProps} />
            </div>

            {/* Botão flutuante filtro — só mobile via CSS */}
            <button className="filtro-fab" onClick={() => setFiltroAberto(true)} aria-label="Abrir filtros">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                </svg>
            </button>

            {/* Drawer filtros mobile — só mobile via CSS */}
            {filtroAberto && (
                <div className="filtro-drawer-overlay" onClick={() => setFiltroAberto(false)}>
                    <div className="filtro-drawer" onClick={e => e.stopPropagation()}>
                        <Filtro {...filtroProps} />
                    </div>
                </div>
            )}

            {/* Centro */}
            <div className="flex flex-col items-center gap-4 flex-1">

                {/* Barra de ações — só mobile via CSS */}
                <div className="mobile-action-bar">
                    <button className="criar_ritual" onClick={() => navigate("/profile")}>Perfil</button>
                    <button className="criar_ritual" onClick={() => navigate("/rituais")}>+ Criar Ritual</button>
                    <div className="mobile-view-toggle">
                        <button className={`view-toggle-btn ${viewMode === "mini" ? "active" : ""}`} onClick={() => { localStorage.setItem('ListMode', "mini"); setViewMode("mini"); }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="9" height="10" rx="1.5" /><line x1="15" y1="9" x2="21" y2="9" /><line x1="15" y1="12" x2="21" y2="12" /><line x1="15" y1="15" x2="21" y2="15" /></svg>
                            Mini
                        </button>
                        <button className={`view-toggle-btn ${viewMode === "card" ? "active" : ""}`} onClick={() => { localStorage.setItem('ListMode', "card"); setViewMode("card"); }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5" /><rect x="7" y="6" width="10" height="6" rx="1.5" fill="currentColor" opacity={0.2} stroke="currentColor" strokeWidth={1.2} /><line x1="7" y1="15" x2="17" y2="15" /><line x1="7" y1="18" x2="12" y2="18" /></svg>
                            Card
                        </button>
                        <button className={`view-toggle-btn ${viewMode === "lista" ? "active" : ""}`} onClick={() => { localStorage.setItem('ListMode', "lista"); setViewMode("lista"); }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                            Lista
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center w-full min-h-[400px]">
                        <Loader loading={true} size={500} />
                    </div>
                ) : viewMode === "lista" ? (
                    <div className="flex flex-col gap-3 w-full max-w-4xl">
                        {rituaisFiltrados?.map((ritual: any) => <Card key={ritual.id} ritual={ritual} viewMode="lista" />)}
                    </div>
                ) : viewMode === "mini" ? (
                    <div className="grid grid-cols-2 gap-4 w-[670px]">
                        {rituaisFiltrados?.map((ritual: any) => <Card key={ritual.id} ritual={ritual} viewMode="mini" />)}
                    </div>
                ) : (
                    Array.from({ length: Math.ceil(rituaisFiltrados?.length / 3) }, (_, i) => (
                        <div className="flex gap-4 justify-center" key={i}>
                            {rituaisFiltrados.slice(i * 3, i * 3 + 3).map((ritual: any) => <Card key={ritual.id} ritual={ritual} viewMode="card" />)}
                        </div>
                    ))
                )}
            </div>

            {/* Coluna lateral direita — oculta no mobile via CSS */}
            <div className="div_Lateral div_Lateral--direita space-y-5">
                <div className="div_criar_ritual">
                    <button className="criar_ritual" onClick={() => navigate("/profile")}>Meu Perfil</button>
                    <button className="criar_ritual" onClick={() => navigate("/rituais")}>+ Criar Ritual</button>
                </div>
                <div>
                    {isLoadingMeus ? (
                        <div className="flex items-center justify-center w-full min-h-[200px]">
                            <Loader loading={true} size={250} />
                        </div>
                    ) : (
                        meus_rituais?.map((ritual: any) => <MiniCard key={ritual.id} ritual={ritual} />)
                    )}
                </div>
            </div>
        </div>
    )
}

export default Principal;