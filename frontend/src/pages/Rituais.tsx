import { ChangeEvent, useRef, useState, useCallback } from "react"
import "./Rituais.css"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { AreaSelector } from "./Area-tela.tsx";


// UTILITÁRIOS DO COMPONENTE PRINCIPAL (Rituais)

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.round(crop.width * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0, 0,
        canvas.width,
        canvas.height,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg");
    });
}


// COMPONENTE PRINCIPAL: Rituais

function Rituais() {
    const uploadRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();

    // Estado do formulário
    const [name, setName] = useState("");
    const [img, setImg] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string>("");
    const [modalSrc, setModalSrc] = useState<string>("");
    const [originalSrc, setOriginalSrc] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    // Estado dos dropdowns 
    const [openList, setOpenList] = useState<string | null>(null);
    const [elemento, setElemento] = useState("Elemento");
    const [circulo, setCirculo] = useState("Circulo");
    const [execucao, setExecucao] = useState("Execução");
    const [alcance, setAlcance] = useState("Alcance");

    const [alvoInput, setAlvoInput] = useState("");
    const [duracaoInput, setDuracaoInput] = useState("");

    // Estado do seletor de área 
    const [area, setArea] = useState("");

    // Mapeamentos de classe
    const circuloText: Record<string, string> = {
        "1° Circulo (1 PE)": "1°",
        "2° Circulo (3 PE)": "2°",
        "3° Circulo (6 PE)": "3°",
        "4° Circulo (10 PE)": "4°",
    };
    const execucaoText: Record<string, string> = {
        "Padrão": "Padrão",
        "Movimento": "Movimento",
        "Completa": "Completa",
        "Reação": "Reação",
        "Livre": "Livre",
    };
    const alcanceText: Record<string, string> = {
        "Pessoal": "Pessoal",
        "Toque": "Toque",
        "Curto (9m)": "Curto (9m)",
        "Médio (18m)": "Médio (18m)",
        "Longo (36m)": "Longo (36m)",
        "Extremo (90m)": "Extremo (90m)",
        "Ilimitado": "Ilimitado",
    };

    // VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS

    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);

    const inv = (campo: string) => camposInvalidos.includes(campo);
    const limparCampo = (campo: string) =>
        setCamposInvalidos((prev) => prev.filter((c) => c !== campo));

    // HANDLERS DE IMAGEM

    const handleChooseClick = () => {
        if (uploadRef.current) uploadRef.current.value = "";
        uploadRef.current?.click();
    };

    const handlePreviewClick = () => {
        if (!originalSrc) { uploadRef.current?.click(); return; }
        setModalSrc(originalSrc + `#${Date.now()}`);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setShowModal(true);
    };

    const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            setOriginalSrc(src);
            setModalSrc(src + `#${Date.now()}`);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setShowModal(true);
        };
        reader.readAsDataURL(file);
    };

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
            width, height
        );
        setCrop(initialCrop);
    }, []);

    const handleConfirm = async () => {
        if (!completedCrop || !imgRef.current) return;
        const blob = await getCroppedImg(imgRef.current, completedCrop);
        const croppedUrl = URL.createObjectURL(blob);
        setPreviewSrc(croppedUrl);
        setImg(new File([blob], "ritual_img.jpg", { type: "image/jpeg" }));
        setShowModal(false);
    };

    // HANDLERS DE DROPDOWNS

    const toggleList = (listName: string) => {
        setOpenList((current) => (current === listName ? null : listName));
    };

    const selectOption = (setter: (value: string) => void, value: string, campo?: string) => {
        setter(value);
        setOpenList(null);
        if (campo) limparCampo(campo);
    };

    const selectAlvo = (valor: string) => {
        setAlvoInput(valor);
        setOpenList(null);
    };

    const selectDuracao = (valor: string) => {
        setDuracaoInput(valor);
        setOpenList(null);
        limparCampo("duracao");
    };

    // SUBMIT

    async function cadastrar() {
        const token = localStorage.getItem("token");
        if (!token) return;

        const descricao = (document.getElementById("Descricao") as HTMLTextAreaElement).value;

        const invalidos: string[] = [];
        if (!name) invalidos.push("nome");
        if (elemento === "Elemento") invalidos.push("elemento");
        if (circulo === "Circulo") invalidos.push("circulo");
        if (execucao === "Execução") invalidos.push("execucao");
        if (alcance === "Alcance") invalidos.push("alcance");
        if (!duracaoInput) invalidos.push("duracao");
        if (!descricao) invalidos.push("descricao");

        if (invalidos.length > 0) {
            setCamposInvalidos(invalidos);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setCamposInvalidos([]);

        if (!img) return;

        const decoded: any = jwtDecode(token);
        const formData = new FormData();

        formData.append("name", name);
        formData.append("file", img);
        formData.append("element", elemento);
        formData.append("circle", circuloText[circulo]);
        formData.append("exec", execucaoText[execucao]);
        formData.append("range", alcanceText[alcance]);
        formData.append("duration", duracaoInput);
        formData.append("area", area);
        formData.append("target", (document.getElementById("Alvo") as HTMLInputElement).value);
        formData.append("effect", (document.getElementById("Efeito") as HTMLInputElement).value);
        formData.append("resistence", (document.getElementById("Resistencia") as HTMLInputElement).value);
        formData.append("dices", (document.getElementById("Dados") as HTMLInputElement).value);
        formData.append("description", descricao);
        formData.append("discent_description", (document.getElementById("DescricaoDiscente") as HTMLTextAreaElement).value);
        formData.append("truly_description", (document.getElementById("DescricaoVerdadeiro") as HTMLTextAreaElement).value);
        formData.append("discent_dices", (document.getElementById("DadosDiscente") as HTMLInputElement).value);
        formData.append("truly_dices", (document.getElementById("DadosVerdadeiro") as HTMLInputElement).value);
        formData.append("creator", decoded.id);

        try {
            await fetch("http://localhost:3000/ritual", {
                method: "POST",
                body: formData
            });
            navigate("/principal");
        } catch (err) {
            console.log(err);
        }
    }

    // BASE RITUAL

    return (
        <div className="editor editor_principal">

            {/* NOME DO RITUAL */}
            <form className="formulario_edicao" action="">
                <label htmlFor="Nome">Nome:</label>
                <input
                    className={`digitacao ${inv("nome") ? "campo-invalido" : ""}`}
                    type="text"
                    name="Nome"
                    id="Nome"
                    value={name}
                    onChange={(e) => { setName(e.target.value); limparCampo("nome"); }}
                />
            </form>

            {/* IMAGEM */}
            <label htmlFor="upload">Imagem:</label>
            <input
                ref={uploadRef}
                className="upload"
                type="file"
                id="upload"
                accept="image/*"
                onChange={handleUploadChange}
                style={{ display: "none" }}
            />
            <div className="div_visual">
                <div className="div_imagem">
                    <button type="button" className="botao escolher_imagem" onClick={handleChooseClick}>
                        Escolher imagem
                    </button>

                    <div className="preview" onClick={handlePreviewClick}>
                        <img
                            className="preview_img"
                            src={previewSrc}
                            style={{ objectFit: "cover" }}
                        />
                    </div>

                    {/* Modal de recorte */}
                    <div id="crop-modal" className={`modal ${showModal ? "show" : ""}`}>
                        <div className="modal-content">
                            <h2>Recortar Imagem</h2>
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                            >
                                <img
                                    ref={imgRef}
                                    id="modal-img"
                                    src={modalSrc}
                                    alt="Imagem selecionada"
                                    onLoad={onImageLoad}
                                    style={{ margin: 0 }}
                                />
                            </ReactCrop>
                            <button id="confirmar" type="button" onClick={handleConfirm}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>

                {/* DROPDOWNS */}
                <div className="div_dropdowns">
                    <label htmlFor="Elemento">Elemento:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Elemento"
                            className={`botao_lista ${elemento !== "Elemento" ? `elemento_${elemento.toLowerCase()}` : ""} ${inv("elemento") ? "campo-invalido" : ""}`}
                            type="button"
                            aria-expanded={openList === "elemento"}
                            aria-controls="lista_elemento"
                            onClick={() => toggleList("elemento")}
                        >
                            {elemento}
                        </button>
                        <div id="lista_elemento" className={`lista lista_elemento ${openList === "elemento" ? "show" : ""}`}>
                            <button className="elemento_sangue" type="button" onClick={() => selectOption(setElemento, "Sangue", "elemento")}>Sangue</button>
                            <button className="elemento_morte" type="button" onClick={() => selectOption(setElemento, "Morte", "elemento")}>Morte</button>
                            <button className="elemento_conhecimento" type="button" onClick={() => selectOption(setElemento, "Conhecimento", "elemento")}>Conhecimento</button>
                            <button className="elemento_energia" type="button" onClick={() => selectOption(setElemento, "Energia", "elemento")}>Energia</button>
                            <button className="elemento_medo" type="button" onClick={() => selectOption(setElemento, "Medo", "elemento")}>Medo</button>
                            <button className="elemento_varia" type="button" onClick={() => selectOption(setElemento, "Varia", "elemento")}>Varia</button>
                        </div>
                    </div>

                    <label htmlFor="Circulo">Circulo:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Circulo"
                            className={`botao_lista ${circuloText[circulo] || ""} ${inv("circulo") ? "campo-invalido" : ""}`}
                            type="button"
                            aria-expanded={openList === "circulo"}
                            aria-controls="lista_circulo"
                            onClick={() => toggleList("circulo")}
                        >
                            {circulo}
                        </button>
                        <div id="lista_circulo" className={`lista lista_circulo ${openList === "circulo" ? "show" : ""}`}>
                            <button className="circulo_1" type="button" onClick={() => selectOption(setCirculo, "1° Circulo (1 PE)", "circulo")}>1° Circulo (1 PE)</button>
                            <button className="circulo_2" type="button" onClick={() => selectOption(setCirculo, "2° Circulo (3 PE)", "circulo")}>2° Circulo (3 PE)</button>
                            <button className="circulo_3" type="button" onClick={() => selectOption(setCirculo, "3° Circulo (6 PE)", "circulo")}>3° Circulo (6 PE)</button>
                            <button className="circulo_4" type="button" onClick={() => selectOption(setCirculo, "4° Circulo (10 PE)", "circulo")}>4° Circulo (10 PE)</button>
                        </div>
                    </div>

                    <label htmlFor="Execucao">Execução:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Execucao"
                            className={`botao_lista ${execucaoText[execucao] || ""} ${inv("execucao") ? "campo-invalido" : ""}`}
                            type="button"
                            aria-expanded={openList === "execucao"}
                            aria-controls="lista_execucao"
                            onClick={() => toggleList("execucao")}
                        >
                            {execucao}
                        </button>
                        <div id="lista_execucao" className={`lista lista_execucao ${openList === "execucao" ? "show" : ""}`}>
                            <button className="execucao_completa" type="button" onClick={() => selectOption(setExecucao, "Completa", "execucao")}>Completa</button>
                            <button className="execucao_padrao" type="button" onClick={() => selectOption(setExecucao, "Padrão", "execucao")}>Padrão</button>
                            <button className="execucao_movimento" type="button" onClick={() => selectOption(setExecucao, "Movimento", "execucao")}>Movimento</button>
                            <button className="execucao_reacao" type="button" onClick={() => selectOption(setExecucao, "Reação", "execucao")}>Reação</button>
                            <button className="execucao_livre" type="button" onClick={() => selectOption(setExecucao, "Livre", "execucao")}>Livre</button>
                        </div>
                    </div>

                    <label htmlFor="Alcance">Alcance:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Alcance"
                            className={`botao_lista ${alcanceText[alcance] || ""} ${inv("alcance") ? "campo-invalido" : ""}`}
                            type="button"
                            aria-expanded={openList === "alcance"}
                            aria-controls="lista_alcance"
                            onClick={() => toggleList("alcance")}
                        >
                            {alcance}
                        </button>
                        <div id="lista_alcance" className={`lista lista_alcance ${openList === "alcance" ? "show" : ""}`}>
                            <button className="alcance_pessoal" type="button" onClick={() => selectOption(setAlcance, "Pessoal", "alcance")}>Pessoal</button>
                            <button className="alcance_toque" type="button" onClick={() => selectOption(setAlcance, "Toque", "alcance")}>Toque</button>
                            <button className="alcance_curto" type="button" onClick={() => selectOption(setAlcance, "Curto (9m)", "alcance")}>Curto (9m)</button>
                            <button className="alcance_medio" type="button" onClick={() => selectOption(setAlcance, "Médio (18m)", "alcance")}>Médio (18m)</button>
                            <button className="alcance_longo" type="button" onClick={() => selectOption(setAlcance, "Longo (36m)", "alcance")}>Longo (36m)</button>
                            <button className="alcance_extremo" type="button" onClick={() => selectOption(setAlcance, "Extremo (90m)", "alcance")}>Extremo (90m)</button>
                            <button className="alcance_ilimitado" type="button" onClick={() => selectOption(setAlcance, "Ilimitado", "alcance")}>Ilimitado</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* INFOS */}
            <div className="div_info">
                <div className="info div_area">
                    <label htmlFor="Area">Área:</label>
                    <AreaSelector value={area} onChange={setArea} />
                </div>

                <div className="info div_efeito">
                    <label htmlFor="Efeito">Efeito:</label>
                    <input className="digitacao_info" type="text" name="Efeito" id="Efeito" />
                </div>

                <div className="info div_alvo" style={{ position: "relative" }}>
                    <label htmlFor="Alvo">Alvo:</label>
                    <div className="input_botao">
                        <input
                            className="digitacao_info alvo"
                            type="text"
                            name="Alvo"
                            id="Alvo"
                            value={alvoInput}
                            onChange={(e) => setAlvoInput(e.target.value)}
                        />
                        <button
                            className="botao_lista"
                            type="button"
                            aria-expanded={openList === "alvo"}
                            aria-controls="lista_alvo"
                            onClick={() => toggleList("alvo")}
                        >
                            ∨
                        </button>
                    </div>
                    <div id="lista_alvo" className={`lista lista_alvo ${openList === "alvo" ? "show" : ""}`}>
                        <button className="alvo_pessoal" type="button" onClick={() => selectAlvo("1 Pessoa")}>1 Pessoa</button>
                        <button className="alvo_toque" type="button" onClick={() => selectAlvo("1 Ser")}>1 Ser</button>
                        <button className="alvo_curto" type="button" onClick={() => selectAlvo("1 Objeto")}>1 Objeto</button>
                        <button className="alvo_medio" type="button" onClick={() => selectAlvo("1 Arma Corpo a Corpo")}>1 Arma Corpo a Corpo</button>
                        <button className="alvo_longo" type="button" onClick={() => selectAlvo("1 Arma de Fogo")}>1 Arma de Fogo</button>
                        <button className="alvo_extremo" type="button" onClick={() => selectAlvo("1 Arma")}>1 Arma</button>
                        <button className="alvo_ilimitado" type="button" onClick={() => selectAlvo("2 Seres Escolhidos")}>2 Seres Escolhidos</button>
                        <button className="alvo_area" type="button" onClick={() => selectAlvo("Seres na Área")}>Seres na Área</button>
                    </div>
                </div>

                <div className="info div_duracao" style={{ position: "relative" }}>
                    <label htmlFor="Duracao">Duração:</label>
                    <div className="input_botao">
                        <input
                            className={`digitacao_info duracao ${inv("duracao") ? "campo-invalido" : ""}`}
                            type="text"
                            name="Duração"
                            id="Duracao"
                            value={duracaoInput}
                            onChange={(e) => { setDuracaoInput(e.target.value); limparCampo("duracao"); }}
                        />
                        <button
                            className="botao_lista"
                            type="button"
                            aria-expanded={openList === "duracao"}
                            aria-controls="lista_duracao"
                            onClick={() => toggleList("duracao")}
                        >
                            ∨
                        </button>
                    </div>
                    <div id="lista_duracao" className={`lista lista_duracao ${openList === "duracao" ? "show" : ""}`}>
                        <button className="alvo_pessoal" type="button" onClick={() => selectDuracao("Cena")}>Cena</button>
                        <button className="alvo_toque" type="button" onClick={() => selectDuracao("Instantânea")}>Instantânea</button>
                        <button className="alvo_curto" type="button" onClick={() => selectDuracao("Sustentada")}>Sustentada</button>
                        <button className="alvo_medio" type="button" onClick={() => selectDuracao("1 Rodada")}>1 Rodada</button>
                        <button className="alvo_longo" type="button" onClick={() => selectDuracao("1 Dia")}>1 Dia</button>
                    </div>
                </div>

                <div className="info div_dados">
                    <label htmlFor="Dados">Dados:</label>
                    <input className="digitacao_info" type="text" name="Dados" id="Dados" placeholder="Ex: 2d6+5" />
                </div>

                <div className="info div_resistencia">
                    <label htmlFor="Resistencia">Resistência:</label>
                    <input className="digitacao_info" type="text" name="Resistência" id="Resistencia" placeholder="Ex: Fortitude (DT 18)" />
                </div>
            </div>

            {/* TEXTOS LONGOS */}
            <label htmlFor="Descricao">Descrição:</label>
            <textarea
                className={`digitacao ${inv("descricao") ? "campo-invalido" : ""}`}
                name="Descrição"
                id="Descricao"
                onChange={() => limparCampo("descricao")}
            />
            <br />

            <label htmlFor="DadosDiscente">Dados Discente:</label>
            <input className="digitacao" type="text" name="DadosDiscente" id="DadosDiscente" />
            <br />

            <label htmlFor="DescricaoDiscente">Descrição Discente:</label>
            <textarea className="digitacao" name="DescriçãoDiscente" id="DescricaoDiscente" placeholder="Ex: Discente (+2PE):" />
            <br />

            <label htmlFor="DadosVerdadeiro">Dados Verdadeiro:</label>
            <input className="digitacao" type="text" name="DadosVerdadeiro" id="DadosVerdadeiro" />
            <br />

            <label htmlFor="DescricaoVerdadeiro">Descrição Verdadeiro:</label>
            <textarea className="digitacao" name="DescriçãoVerdadeiro" id="DescricaoVerdadeiro" placeholder="Ex: Verdadeiro (+5PE):" />
            <br />

            <button type="button" className="botao salvar" onClick={cadastrar}>
                Salvar Ritual
            </button>
        </div>
    );
}

export default Rituais;