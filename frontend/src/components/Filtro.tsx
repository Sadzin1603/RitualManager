import { useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

function Filtro({rituais, setRituaisFiltrados, viewMode, setViewMode} : { rituais: any[]; setRituaisFiltrados: (rituais: any[]) => void; viewMode: string; setViewMode: (mode: string) => void }) {
    const [openList, setOpenList] = useState<string | null>(null);
    const [elemento, setElemento] = useState("Todos");
    const [circulo, setCirculo] = useState("Todos");
    const [execucao, setExecucao] = useState("Todos");
    const [alcance, setAlcance] = useState("Todos");
    const [searchNome, setSearchNome] = useState("");
    const [somenteFavoritos, setSomenteFavoritos] = useState(false);

    const { data: rituaisFavoritados } = useQuery({
        queryKey: ['rituais_favoritados'],
        queryFn: async () => {
            const token = localStorage.getItem("token") || '';
            const res = await fetch(`http://localhost:3000/user/${(jwtDecode(token) as any).id}/rituais/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.json();
        },
        enabled: somenteFavoritos,
    });

    const favoritosIds = useMemo(
        () => new Set((rituaisFavoritados || []).map((r: any) => r.id)),
        [rituaisFavoritados]
    );

    const circuloValor: Record<string, string> = {
        "1° Circulo (1 PE)": "1°",
        "2° Circulo (3 PE)": "2°",
        "3° Circulo (6 PE)": "3°",
        "4° Circulo (10 PE)": "4°",
    };
    const toggleList = (listName: string) => {
        setOpenList((current) => (current === listName ? null : listName));
    };

    const selectElemento = (valor: string) => {
        setElemento(valor);
        setOpenList(null);
    };

    const elementoClasse: Record<string, string> = {
        "Sangue": "elemento_sangue",
        "Conhecimento": "elemento_conhecimento",
        "Energia": "elemento_energia",
        "Morte": "elemento_morte",
        "Medo": "elemento_medo",
        "Varia": "elemento_varia",
    };

    const selectCirculo = (valor: string) => {
        setCirculo(valor);
        setOpenList(null);
    };

    const circuloClasse: Record<string, string> = {
        "1° Circulo (1 PE)": "circulo_1",
        "2° Circulo (3 PE)": "circulo_2",
        "3° Circulo (6 PE)": "circulo_3",
        "4° Circulo (10 PE)": "circulo_4",
    };

    const selectExecucao = (valor: string) => {
        setExecucao(valor);
        setOpenList(null);
    }

    const execucaoClasse: Record<string, string> = {
        "Padrão": "execucao_padrao",
        "Movimento": "execucao_movimento",
        "Completa": "execucao_completa",
        "Reação": "execucao_reacao",
        "Livre": "execucao_livre",
    };

    const selectAlcance = (valor: string) => {
        setAlcance(valor);
        setOpenList(null);
    }

    const alcanceClasse: Record<string, string> = {
        "Pessoal": "alcance_pessoal",
        "Toque": "alcance_toque",
        "Curto (9m)": "alcance_curto",
        "Médio (18m)": "alcance_medio",
        "Longo (36m)": "alcance_longo",
        "Extremo (90m)": "alcance_extremo",
        "Ilimitado": "alcance_ilimitado",
    };

    const limparFiltros = () => {
        setElemento("Todos");
        setCirculo("Todos");
        setExecucao("Todos");
        setAlcance("Todos");
        setSearchNome("");
        setSomenteFavoritos(false);
    };

    useEffect(() => {
    const filtrados = rituais?.filter((ritual: any) => {
        const passaNome =
            searchNome === "" ||
            ritual.name.toLowerCase().includes(searchNome.toLowerCase());

        const passaElem =
            elemento === "Todos" ||
            ritual.element === elemento;

        const passaCirculo =
            circulo === "Todos" ||
            ritual.circle === circuloValor[circulo];

        const passaExecucao =
            execucao === "Todos" ||
            ritual.exec === execucao;

        const passaAlcance =
            alcance === "Todos" ||
            ritual.range === alcance;

        const passaFavoritos =
            !somenteFavoritos ||
            favoritosIds.has(ritual.id);

        return (passaNome && passaElem && passaCirculo && passaExecucao && passaAlcance && passaFavoritos
        );
    });

    setRituaisFiltrados(filtrados || []);
}, [rituais, searchNome, elemento, circulo, execucao, alcance, somenteFavoritos, favoritosIds]);
    return(
        <div className="div_filtros">
                    {/* Header */}
                    <nav className="header_filtros">
                        <h1 className="text-lg font-bold">Filtros</h1>
                        <button className="limpar_filtros" onClick={limparFiltros}>
                            Limpar
                        </button>
                    </nav>

                    {/* Botões de visualização */}
                    <div className="modo view-toggle-group">
                        <button
                            className={`view-toggle-btn ${viewMode === "mini" ? "active" : ""}`}
                            onClick={() =>{
                            localStorage.setItem('ListMode', "mini")    
                            setViewMode("mini")}}
                            aria-pressed={viewMode === "mini"}
                            title="Mini"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="7" width="9" height="10" rx="1.5" />
                                <line x1="15" y1="9" x2="21" y2="9" />
                                <line x1="15" y1="12" x2="21" y2="12" />
                                <line x1="15" y1="15" x2="21" y2="15" />
                            </svg>
                            Mini
                        </button>
                        <button
                            className={`view-toggle-btn ${viewMode === "card" ? "active" : ""}`}
                            onClick={() =>{ 
                                localStorage.setItem('ListMode', "card")
                                setViewMode("card")}}
                            aria-pressed={viewMode === "card"}
                            title="Card"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                                <rect x="4" y="3" width="16" height="18" rx="2.5" />
                                <rect x="7" y="6" width="10" height="6" rx="1.5" fill="currentColor" opacity={0.2} stroke="currentColor" strokeWidth={1.2} />
                                <line x1="7" y1="15" x2="17" y2="15" />
                                <line x1="7" y1="18" x2="12" y2="18" />
                            </svg>
                            Card
                        </button>
                        <button
                            className={`view-toggle-btn ${viewMode === "lista" ? "active" : ""}`}
                            onClick={() =>{ 
                                localStorage.setItem('ListMode', "lista")
                                setViewMode("lista")}}
                            aria-pressed={viewMode === "lista"}
                            title="Lista"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                            Lista
                        </button>
                    </div>

                    <div className='flex'>
                    {/* Campo de pesquisa ritual*/}
                    <div className="div_pesquisa">
                        <input
                            className="pesquisa"
                            type="text"
                            placeholder="Nome do ritual..."
                            value={searchNome}
                            onChange={(e) => setSearchNome(e.target.value)}
                        />
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icone_pesquisa">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Botão de faforitos */}
                    <button
                            className={`bg-[#0c0c0c] rounded-lg p-2 mt-2 ml-2 ${somenteFavoritos ? "ring-1 ring-red-500" : ""}`}
                            onClick={() => setSomenteFavoritos((prev) => !prev)}
                            title="Somente favoritos"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={somenteFavoritos ? "red" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={somenteFavoritos ? "red" : "currentColor"} className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.239-4.5-5-4.5-1.74 0-3.273.8-4 2.019-.727-1.22-2.26-2.019-4-2.019-2.761 0-5 2.015-5 4.5 0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </button>
                    </div>

                    {/* Filtro de Elemento */}
                    <div className="filtro filtro_elemento">
                        <h2 className="text-sm font-medium text-zinc-400">Elemento</h2>
                        <div style={{ position: "relative" }}>
                            <button
                                className={`botao_lista ${elementoClasse[elemento] || ""}`}
                                type="button"
                                aria-expanded={openList === "elemento"}
                                aria-controls="lista_elemento_filtro"
                                onClick={() => toggleList("elemento")}
                            >
                                {elemento}
                            </button>
                            <div
                                id="lista_elemento_filtro"
                                className={`lista ${openList === "elemento" ? "show" : ""}`}
                            >
                                <button type="button" onClick={() => selectElemento("Todos")}>Todos</button>
                                <button className="elemento_sangue" type="button" onClick={() => selectElemento("Sangue")}>Sangue</button>
                                <button className="elemento_conhecimento" type="button" onClick={() => selectElemento("Conhecimento")}>Conhecimento</button>
                                <button className="elemento_energia" type="button" onClick={() => selectElemento("Energia")}>Energia</button>
                                <button className="elemento_morte" type="button" onClick={() => selectElemento("Morte")}>Morte</button>
                                <button className="elemento_medo" type="button" onClick={() => selectElemento("Medo")}>Medo</button>
                                <button className="elemento_varia" type="button" onClick={() => selectElemento("Varia")}>Varia</button>
                            </div>
                        </div>
                    </div>

                    {/* Filtro de Circulo */}
                    <div className="filtro filtro_circulo">
                        <h2 className="text-sm font-medium text-zinc-400">Circulo</h2>
                        <div style={{ position: "relative" }}>
                            <button
                                className={`botao_lista ${circuloClasse[circulo] || ""}`}
                                type="button"
                                aria-expanded={openList === "circulo"}
                                aria-controls="lista_circulo_filtro"
                                onClick={() => toggleList("circulo")}
                            >
                                {circulo}
                            </button>
                            <div
                                id="lista_circulo_filtro"
                                className={`lista ${openList === "circulo" ? "show" : ""}`}
                            >
                                <button type="button" onClick={() => selectCirculo("Todos")}>Todos</button>
                                <button className="circulo_1" type="button" onClick={() => selectCirculo("1° Circulo (1 PE)")}>1° Circulo</button>
                                <button className="circulo_2" type="button" onClick={() => selectCirculo("2° Circulo (3 PE)")}>2° Circulo</button>
                                <button className="circulo_3" type="button" onClick={() => selectCirculo("3° Circulo (6 PE)")}>3° Circulo</button>
                                <button className="circulo_4" type="button" onClick={() => selectCirculo("4° Circulo (10 PE)")}>4° Circulo</button>
                            </div>
                        </div>
                    </div>

                    {/* Filtro de Execução */}
                    <div className="filtro filtro_execucao">
                        <h2 className="text-sm font-medium text-zinc-400">Execução</h2>
                        <div style={{ position: "relative" }}>
                            <button
                                className={`botao_lista ${execucaoClasse[execucao] || ""}`}
                                type="button"
                                aria-expanded={openList === "execucao"}
                                aria-controls="lista_execucao_filtro"
                                onClick={() => toggleList("execucao")}
                            >
                                {execucao}
                            </button>
                            <div
                                id="lista_execucao_filtro"
                                className={`lista ${openList === "execucao" ? "show" : ""}`}
                            >
                                <button type="button" onClick={() => selectExecucao("Todos")}>Todos</button>
                                <button className="execucao_completa" type="button" onClick={() => selectExecucao("Completa")}>Completa</button>
                                <button className="execucao_padrao" type="button" onClick={() => selectExecucao("Padrão")}>Padrão</button>
                                <button className="execucao_movimento" type="button" onClick={() => selectExecucao("Movimento")}>Movimento</button>
                                <button className="execucao_reacao" type="button" onClick={() => selectExecucao("Reação")}>Reação</button>
                                <button className="execucao_livre" type="button" onClick={() => selectExecucao("Livre")}>Livre</button>
                            </div>
                        </div>
                    </div>

                    {/* Filtro de Alcance */}
                    <div className="filtro filtro_alcance">
                        <h2 className="text-sm font-medium text-zinc-400">Alcance</h2>
                        <div style={{ position: "relative" }}>
                            <button
                                className={`botao_lista ${alcanceClasse[alcance] || ""}`}
                                type="button"
                                aria-expanded={openList === "alcance"}
                                aria-controls="lista_alcance_filtro"
                                onClick={() => toggleList("alcance")}
                            >
                                {alcance}
                            </button>
                            <div
                                id="lista_alcance_filtro"
                                className={`lista ${openList === "alcance" ? "show" : ""}`}
                            >
                                <button type="button" onClick={() => selectAlcance("Todos")}>Todos</button>
                                <button className="alcance_pessoal" type="button" onClick={() => selectAlcance("Pessoal")}>Pessoal</button>
                                <button className="alcance_toque" type="button" onClick={() => selectAlcance("Toque")}>Toque</button>
                                <button className="alcance_curto" type="button" onClick={() => selectAlcance("Curto (9m)")}>Curto (9m)</button>
                                <button className="alcance_medio" type="button" onClick={() => selectAlcance("Médio (18m)")}>Médio (18m)</button>
                                <button className="alcance_longo" type="button" onClick={() => selectAlcance("Longo (36m)")}>Longo (36m)</button>
                                <button className="alcance_extremo" type="button" onClick={() => selectAlcance("Extremo (90m)")}>Extremo (90m)</button>
                                <button className="alcance_ilimitado" type="button" onClick={() => selectAlcance("Ilimitado")}>Ilimitado</button>
                            </div>
                        </div>
                    </div>

                </div>
    )

}

export default Filtro;