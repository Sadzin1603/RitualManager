import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { useEffect, useState, useMemo } from "react";
import "./Principal.css";

function Principal() {
    const [rituais, setRituais] = useState([]);
    const [openList, setOpenList] = useState<string | null>(null);
    const [elemento, setElemento] = useState("Todos");
    const [circulo, setCirculo] = useState("Todos");
    const [searchNome, setSearchNome] = useState("");  // ← novo

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:3000/ritual?status=aprovado");
            const data = await res.json();
            setRituais(data);
        }

        fetchData();
    }, []);

    const navigate = useNavigate();

    // ── Lógica de filtragem ───────────────────────────────────────────────────
    //
    //  O banco salva circle como "1°", "2°" etc. (veja circuloValor abaixo).
    //  Cada condição usa: filtro vazio/padrão → passa tudo; filtro ativo → compara.
    //  O && final exige que TODOS os filtros ativos sejam satisfeitos.
    //
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

            return passaNome && passaElem && passaCirculo;
        });
    }, [rituais, searchNome, elemento, circulo]);

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

    const limparFiltros = () => {
        setElemento("Todos");
        setCirculo("Todos");
        setSearchNome("");  // ← limpa o nome também
    };

    return (
        <div className="title w-auto min-h-screen flex justify-center p-6">
            <div className="space-y-4">
                {/* Renderiza só os rituais que passaram em todos os filtros */}
                {rituaisFiltrados.map((ritual: any) => (
                    <Card key={ritual.id} ritual={ritual}></Card>
                ))}
            </div>
            <div className="div_Lateral">

                {/* Botão principal */}
                <button
                    className="criar_ritual"
                    onClick={() => navigate("/rituais")}
                >
                    + Criar Ritual
                </button>

                {/* Filtros */}
                <div className="div_filtros">

                    {/* Header */}
                    <nav className="header">
                        <h1 className="text-lg font-bold">Filtros</h1>
                        <button className="limpar_filtros" onClick={limparFiltros}>
                            Limpar
                        </button>
                    </nav>

                    {/* Campo de pesquisa */}
                    <div className="div_pesquisa">
                        <input
                            className="pesquisa"
                            type="text"
                            placeholder="Pesquisar nome..."
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

                </div>
            </div>
        </div>
    )
}

export default Principal;