import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState, useMemo } from "react";
import "./Principal.css";
import MiniCard from "../components/MiniCard";

function Principal() {
    const [rituais, setRituais] = useState([]);
    const [openList, setOpenList] = useState<string | null>(null);
    const [elemento, setElemento] = useState("Todos");
    const [circulo, setCirculo] = useState("Todos");
    const [execucao, setExecucao] = useState("Todos");
    const [alcance, setAlcance] = useState("Todos");
    const [searchNome, setSearchNome] = useState("");

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:3000/ritual?status=aprovado");
            const data = await res.json();
            setRituais(data);
        }

        fetchData();
    }, []);

    const navigate = useNavigate();

    const circuloValor: Record<string, string> = {
        "1° Circulo (1 PE)": "1°",
        "2° Circulo (3 PE)": "2°",
        "3° Circulo (6 PE)": "3°",
        "4° Circulo (10 PE)": "4°",
    };

    const rituaisFiltrados = useMemo(() => {
        return rituais.filter((ritual: any) => {
            const passaNome = searchNome === ""
                || ritual.name.toLowerCase().includes(searchNome.toLowerCase());

            const passaElem = elemento === "Todos"
                || ritual.element === elemento;

            const passaCirculo = circulo === "Todos"
                || ritual.circle === circuloValor[circulo];

            const passaExecucao = execucao === "Todos"
                || ritual.exec === execucao;

            const passaAlcance = alcance === "Todos"
                || ritual.range === alcance;

            return passaNome && passaElem && passaCirculo && passaExecucao && passaAlcance;
        });
    }, [rituais, searchNome, elemento, circulo, execucao, alcance]);

    // ─────────────────────────────────────────────────────────────────────────

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
    };

    return (
        <div className="title w-auto min-h-screen flex justify-around p-8 gap-3">

            <div className="div_Lateral flex-1">

                {/* Filtros */}
                <div className="div_filtros">

                    {/* Header */}
                    <nav className="header_filtros">
                        <h1 className="text-lg font-bold">Filtros</h1>
                        <button className="limpar_filtros" onClick={limparFiltros}>
                            Limpar
                        </button>
                    </nav>

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
            </div>

            <div className="flex flex-col items-center gap-4 flex-1">
                {Array.from({ length: Math.ceil(rituaisFiltrados.length / 3) }, (_, rowIndex) => {
                    const rowItems = rituaisFiltrados.slice(rowIndex * 3, rowIndex * 3 + 3);
                    return (
                        <div className="flex gap-4 justify-center" key={rowIndex}>
                            {rowItems.map((ritual: any) => <Card key={ritual.id} ritual={ritual} />)}
                        </div>
                    );
                })}
            </div>

            <div className="div_Lateral flex-1 space-y-5">
                <div className="div_criar_ritual">
                    {/* Botão Perfil */}
                    <button
                        className="criar_ritual"
                        onClick={() => navigate("/profile")}
                    >
                        Meu Perfil
                    </button>
                    {/* Botão principal */}
                    <button
                        className="criar_ritual"
                        onClick={() => navigate("/rituais")}
                    >
                        + Criar Ritual
                    </button>
                </div>
                <div>
                    {rituaisFiltrados.map((ritual: any) => (
                        ritual.creator?.id == jwtDecode(localStorage.getItem("token")).id
                            ? <MiniCard key={ritual.id} ritual={ritual}></MiniCard>
                            :
                            ""
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Principal;
