import { ChangeEvent, useRef, useState } from "react"
import "./Rituais.css"
import { useNavigate } from "react-router-dom";

function Rituais() {
    const uploadRef = useRef<HTMLInputElement | null>(null);
    const [previewSrc, setPreviewSrc] = useState("");
    const [modalSrc, setModalSrc] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [openList, setOpenList] = useState<string | null>(null);
    const [elemento, setElemento] = useState("Elemento");
    const [circulo, setCirculo] = useState("Circulo");
    const [execucao, setExecucao] = useState("Execução");
    const [alcance, setAlcance] = useState("Alcance");
    const navigate = useNavigate();

    const handlePreviewClick = () => {
        uploadRef.current?.click();
    };

    const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            setPreviewSrc(src);
            setModalSrc(src);
            setShowModal(true);
        };
        reader.readAsDataURL(file);
    };

    const handleConfirm = () => {
        setShowModal(false);
    };

    const toggleList = (listName: string) => {
        setOpenList((current) => (current === listName ? null : listName));
    };

    const selectOption = (setter: (value: string) => void, value: string) => {
        setter(value);
        setOpenList(null);
    };

    return (
        <div className="editor editor_principal">
            <form className="formulario_edicao" action="">
                <label htmlFor="Nome">Nome:</label>
                <input className="digitacao" type="text" name="Nome" id="Nome" />
            </form>

            <label htmlFor="upload">Imagem:</label>
            <input
                ref={uploadRef}
                className="upload"
                type="file"
                id="upload"
                accept="image/*"
                onChange={handleUploadChange}
                style={{ display: 'none' }}
            />
            <button type="button" className="botao escolher_imagem" onClick={handlePreviewClick}>Escolher imagem</button>

            <div className="preview" onClick={handlePreviewClick}>
                <img className="preview_img" src={previewSrc}/>
            </div>

            <div id="crop-modal" className={`modal ${showModal ? "show" : ""}`}>
                <div className="modal-content">
                    <h2>Imagem</h2>
                    <img id="modal-img" src={modalSrc} alt="Imagem selecionada" />
                    <button id="confirmar" type="button" onClick={handleConfirm}>Confirmar</button>
                </div>
            </div>

            <label htmlFor="Elemento">Elemento:</label>
            <button
                id="Elemento"
                className="botao_lista"
                data-target=".lista_elemento"
                type="button"
                aria-expanded={openList === "elemento"}
                aria-controls="lista_elemento"
                onClick={() => toggleList("elemento")}
            >
                {elemento}
            </button>
            <div id="lista_elemento" className={`lista lista_elemento ${openList === "elemento" ? "show" : ""}`}>
                <button type="button" onClick={() => selectOption(setElemento, "Sangue")}>Sangue</button>
                <button type="button" onClick={() => selectOption(setElemento, "Morte")}>Morte</button>
                <button type="button" onClick={() => selectOption(setElemento, "Conhecimento")}>Conhecimento</button>
                <button type="button" onClick={() => selectOption(setElemento, "Energia")}>Energia</button>
                <button type="button" onClick={() => selectOption(setElemento, "Medo")}>Medo</button>
                <button type="button" onClick={() => selectOption(setElemento, "Varia")}>Varia</button>
            </div>
            <br />

            <label htmlFor="Circulo">Circulo:</label>
            <button
                id="Circulo"
                className="botao_lista"
                data-target=".lista_circulo"
                type="button"
                aria-expanded={openList === "circulo"}
                aria-controls="lista_circulo"
                onClick={() => toggleList("circulo")}
            >
                {circulo}
            </button>
            <div id="lista_circulo" className={`lista lista_circulo ${openList === "circulo" ? "show" : ""}`}>
                <button type="button" onClick={() => selectOption(setCirculo, "1° Circulo (1 PE)")}>1° Circulo (1 PE)</button>
                <button type="button" onClick={() => selectOption(setCirculo, "2° Circulo (3 PE)")}>2° Circulo (3 PE)</button>
                <button type="button" onClick={() => selectOption(setCirculo, "3° Circulo (6 PE)")}>3° Circulo (6 PE)</button>
                <button type="button" onClick={() => selectOption(setCirculo, "4° Circulo (10 PE)")}>4° Circulo (10 PE)</button>
            </div>
            <br />

            <label htmlFor="Execucao">Execução:</label>
            <button
                id="Execucao"
                className="botao_lista"
                data-target=".lista_execucao"
                type="button"
                aria-expanded={openList === "execucao"}
                aria-controls="lista_execucao"
                onClick={() => toggleList("execucao")}
            >
                {execucao}
            </button>
            <div id="lista_execucao" className={`lista lista_execucao ${openList === "execucao" ? "show" : ""}`}>
                <button type="button" onClick={() => selectOption(setExecucao, "Padrão")}>Padrão</button>
                <button type="button" onClick={() => selectOption(setExecucao, "Movimento")}>Movimento</button>
                <button type="button" onClick={() => selectOption(setExecucao, "Completa")}>Completa</button>
                <button type="button" onClick={() => selectOption(setExecucao, "Reação")}>Reação</button>
                <button type="button" onClick={() => selectOption(setExecucao, "Livre")}>Livre</button>
            </div>
            <br />

            <label htmlFor="Alcance">Alcance:</label>
            <button
                id="Alcance"
                className="botao_lista"
                data-target=".lista_alcance"
                type="button"
                aria-expanded={openList === "alcance"}
                aria-controls="lista_alcance"
                onClick={() => toggleList("alcance")}
            >
                {alcance}
            </button>
            <div id="lista_alcance" className={`lista lista_alcance ${openList === "alcance" ? "show" : ""}`}>
                <button type="button" onClick={() => selectOption(setAlcance, "Pessoal")}>Pessoal</button>
                <button type="button" onClick={() => selectOption(setAlcance, "Toque")}>Toque</button>
                <button type="button" onClick={() => selectOption(setAlcance, "Curto (9m)")}>Curto (9m)</button>
                <button type="button" onClick={() => selectOption(setAlcance, "Médio (18m)")}>Médio (18m)</button>
                <button type="button" onClick={() => selectOption(setAlcance, "Longo (36m)")}>Longo (36m)</button>
                <button type="button" onClick={() => selectOption(setAlcance, "Extremo (90m)")}>Extremo (90m)</button>
                <button type="button" onClick={() => selectOption(setAlcance, "Ilimitado")}>Ilimitado</button>
            </div>
            <br />

            <label htmlFor="Area">Área:</label>
            <input className="digitacao" type="text" name="Área" id="Area"></input>
            <br />

            <label htmlFor="Alvo">Alvo:</label>
            <input className="digitacao" type="text" name="Alvo" id="Alvo"></input>
            <br />

            <label htmlFor="Duracao">Duração:</label>
            <input className="digitacao" type="text" name="Duração" id="Duracao"></input>
            <br />

            <label htmlFor="Efeito">Efeito:</label>
            <input className="digitacao" type="text" name="Efeito" id="Efeito"></input>
            <br />

            <label htmlFor="Resistencia">Resistência:</label>
            <input className="digitacao" type="text" name="Resistência" id="Resistencia"></input>
            <br />

            <label htmlFor="Dados">Dados:</label>
            <input className="digitacao" type="text" name="Dados" id="Dados"></input>
            <br />

            <label htmlFor="Descricao">Descrição:</label>
                <textarea className="digitacao" name="Descrição" id="Descricao" ></textarea>
            <br />

            <label htmlFor="DadosDiscente">Dados Discente:</label>
            <input className="digitacao" type="text" name="DadosDiscente" id="DadosDiscente"></input>
            <br />

            <label htmlFor="DescricaoDiscente">Descrição Discente:</label>
                <textarea className="digitacao" name="DescriçãoDiscente" id="DescricaoDiscente" ></textarea>
            <br />

            <label htmlFor="DadosVerdadeiro">Dados Verdadeiro:</label>
            <input className="digitacao" type="text" name="DadosVerdadeiro" id="DadosVerdadeiro"></input>
            <br />

            <label htmlFor="DescricaoVerdadeiro">Descrição Verdadeiro:</label>
                <textarea className="digitacao" name="DescriçãoVerdadeiro" id="DescricaoVerdadeiro"></textarea>
            <br />
            <button type="button" className="botao salvar" onClick={() => navigate("/")} >
                Salvar Ritual
            </button>
        </div>
    )
}

export default Rituais;