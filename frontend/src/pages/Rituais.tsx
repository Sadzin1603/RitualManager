import { ChangeEvent, useRef, useState, useCallback } from "react"
import "./Rituais.css"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

/* Função para gerar a imagem recortada */
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // tamanho do canvas em pixels NATURAIS da imagem, não da renderizada
    canvas.width = Math.round(crop.width * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob!);
        }, "image/jpeg");
    });
}

function Rituais() {
    const uploadRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [name, setName] = useState("")
    const [img, setImg] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string>("");
    const [modalSrc, setModalSrc] = useState<string>("");
    const [originalSrc, setOriginalSrc] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [openList, setOpenList] = useState<string | null>(null);
    const [elemento, setElemento] = useState("Elemento");
    const [circulo, setCirculo] = useState("Circulo");
    const [execucao, setExecucao] = useState("Execução");
    const [alcance, setAlcance] = useState("Alcance");
    const navigate = useNavigate();

    // Botão "Escolher imagem" — sempre abre o file picker para trocar a foto
    const handleChooseClick = () => {
        if (uploadRef.current) {
            uploadRef.current.value = "";
        }
        uploadRef.current?.click();
    };

    // Clicar no preview — reabre o modal com a imagem original para recortar de novo
    const handlePreviewClick = () => {
        if (!originalSrc) {
            uploadRef.current?.click();
            return;
        }
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
            width,
            height
        );
        setCrop(initialCrop);
    }, []);

    const handleConfirm = async () => {
        if (!completedCrop || !imgRef.current) return;

        const blob = await getCroppedImg(imgRef.current, completedCrop);
        const croppedUrl = URL.createObjectURL(blob);
        setPreviewSrc(croppedUrl);

        const croppedFile = new File([blob], "ritual_img.jpg", { type: "image/jpeg" });
        setImg(croppedFile);

        setShowModal(false);
    };

    const toggleList = (listName: string) => {
        setOpenList((current) => (current === listName ? null : listName));
    };

    const selectOption = (setter: (value: string) => void, value: string) => {
        setter(value);
        setOpenList(null);
    };

    const circuloText: Record<string, string> = {
        "1° Circulo (1 PE)": "circulo_1",
        "2° Circulo (3 PE)": "circulo_2",
        "3° Circulo (6 PE)": "circulo_3",
        "4° Circulo (10 PE)": "circulo_4",
    };

    const execucaoText: Record<string, string> = {
        "Padrão": "execucao_padrao",
        "Movimento": "execucao_movimento",
        "Completa": "execucao_completa",
        "Reação": "execucao_reacao",
        "Livre": "execucao_livre",
    };

    const alcanceText: Record<string, string> = {
        "Pessoal": "alcance_pessoal",
        "Toque": "alcance_toque",
        "Curto (9m)": "alcance_curto",
        "Médio (18m)": "alcance_medio",
        "Longo (36m)": "alcance_longo",
        "Extremo (90m)": "alcance_extremo",
        "Ilimitado": "alcance_ilimitado",
    };

    async function cadastrar() {
        const formData = new FormData();
        const token = localStorage.getItem('token');

        if (!token) return;

        const decoded: any = jwtDecode(token);

        if (!img) {
            console.log("Sem imagem");
            return;
        }

        formData.append("name", name);
        formData.append("file", img);
        formData.append("element", elemento);
        formData.append("circle", circuloText[circulo]);
        formData.append("exec", execucaoText[execucao]);
        formData.append("range", alcanceText[alcance]);
        formData.append("area", (document.getElementById("Area") as HTMLInputElement).value);
        formData.append("target", (document.getElementById("Alvo") as HTMLInputElement).value);
        formData.append("effect", (document.getElementById("Efeito") as HTMLInputElement).value);
        formData.append("resistence", (document.getElementById("Resistencia") as HTMLInputElement).value);
        formData.append("dices", (document.getElementById("Dados") as HTMLInputElement).value);
        formData.append("description", (document.getElementById("Descricao") as HTMLTextAreaElement).value);
        formData.append("discent_description", (document.getElementById("DescricaoDiscente") as HTMLTextAreaElement).value);
        formData.append("truly_description", (document.getElementById("DescricaoVerdadeiro") as HTMLTextAreaElement).value);
        formData.append("discent_dices", (document.getElementById("DadosDiscente") as HTMLInputElement).value);
        formData.append("truly_dices", (document.getElementById("DadosVerdadeiro") as HTMLInputElement).value);
        formData.append("creator", decoded.id);

        try{
            await fetch("http://localhost:3000/ritual", {
                method: "POST",
                body: formData
            })
            navigate("/principal")

        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="editor editor_principal">
            <form className="formulario_edicao" action="">
                <label htmlFor="Nome">Nome:</label>
                <input className="digitacao" type="text" name="Nome" id="Nome" value={name} onChange={(e) => setName(e.target.value)} />
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
            <div className="div_visual">
                <div className="div_imagem">
                    { }
                    <button type="button" className="botao escolher_imagem" onClick={handleChooseClick}>Escolher imagem</button>

                    { }
                    <div className="preview" onClick={handlePreviewClick}>
                        <img
                            className="preview_img"
                            src={previewSrc}
                            style={{ objectFit: "cover" }}
                        />
                    </div>

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
                            <button id="confirmar" type="button" onClick={handleConfirm}>Confirmar</button>
                        </div>
                    </div>
                </div>

                <div className="div_dropdowns">
                    <label htmlFor="Elemento">Elemento:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Elemento"
                            className={" botao_lista " + (elemento !== "Elemento" ? `elemento_${elemento.toLowerCase()}` : "")}
                            data-target=".lista_elemento"
                            type="button"
                            aria-expanded={openList === "elemento"}
                            aria-controls="lista_elemento"
                            onClick={() => toggleList("elemento")}
                        >
                            {elemento}
                        </button>

                        <div id="lista_elemento" className={`lista lista_elemento ${openList === "elemento" ? "show" : ""}`}>
                            <button className="elemento_sangue" type="button" onClick={() => selectOption(setElemento, "Sangue")}>Sangue</button>
                            <button className="elemento_morte" type="button" onClick={() => selectOption(setElemento, "Morte")}>Morte</button>
                            <button className="elemento_conhecimento" type="button" onClick={() => selectOption(setElemento, "Conhecimento")}>Conhecimento</button>
                            <button className="elemento_energia" type="button" onClick={() => selectOption(setElemento, "Energia")}>Energia</button>
                            <button className="elemento_medo" type="button" onClick={() => selectOption(setElemento, "Medo")}>Medo</button>
                            <button className="elemento_varia" type="button" onClick={() => selectOption(setElemento, "Varia")}>Varia</button>
                        </div>
                    </div>

                    <label htmlFor="Circulo">Circulo:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Circulo"
                            className={" botao_lista " + (circuloText[circulo] || "")}
                            data-target=".lista_circulo"
                            type="button"
                            aria-expanded={openList === "circulo"}
                            aria-controls="lista_circulo"
                            onClick={() => toggleList("circulo")}
                        >
                            {circulo}
                        </button>

                        <div id="lista_circulo" className={`lista lista_circulo ${openList === "circulo" ? "show" : ""}`}>
                            <button className="circulo_1" type="button" onClick={() => selectOption(setCirculo, "1° Circulo (1 PE)")}>1° Circulo (1 PE)</button>
                            <button className="circulo_2" type="button" onClick={() => selectOption(setCirculo, "2° Circulo (3 PE)")}>2° Circulo (3 PE)</button>
                            <button className="circulo_3" type="button" onClick={() => selectOption(setCirculo, "3° Circulo (6 PE)")}>3° Circulo (6 PE)</button>
                            <button className="circulo_4" type="button" onClick={() => selectOption(setCirculo, "4° Circulo (10 PE)")}>4° Circulo (10 PE)</button>
                        </div>
                    </div>

                    <label htmlFor="Execucao">Execução:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Execucao"
                            className={"botao_lista " + (execucaoText[execucao] || "")}
                            data-target=".lista_execucao"
                            type="button"
                            aria-expanded={openList === "execucao"}
                            aria-controls="lista_execucao"
                            onClick={() => toggleList("execucao")}
                        >
                            {execucao}
                        </button>

                        <div id="lista_execucao" className={`lista lista_execucao ${openList === "execucao" ? "show" : ""}`}>
                            <button className="execucao_completa" type="button" onClick={() => selectOption(setExecucao, "Completa")}>Completa</button>
                            <button className="execucao_padrao" type="button" onClick={() => selectOption(setExecucao, "Padrão")}>Padrão</button>
                            <button className="execucao_movimento" type="button" onClick={() => selectOption(setExecucao, "Movimento")}>Movimento</button>
                            <button className="execucao_reacao" type="button" onClick={() => selectOption(setExecucao, "Reação")}>Reação</button>
                            <button className="execucao_livre" type="button" onClick={() => selectOption(setExecucao, "Livre")}>Livre</button>
                        </div>
                    </div>

                    <label htmlFor="Alcance">Alcance:</label>
                    <div style={{ position: "relative" }}>
                        <button
                            id="Alcance"
                            className={"botao_lista " + (alcanceText[alcance] || "")}
                            data-target=".lista_alcance"
                            type="button"
                            aria-expanded={openList === "alcance"}
                            aria-controls="lista_alcance"
                            onClick={() => toggleList("alcance")}
                        >
                            {alcance}
                        </button>

                        <div id="lista_alcance" className={`lista lista_alcance ${openList === "alcance" ? "show" : ""}`}>
                            <button className="alcance_pessoal" type="button" onClick={() => selectOption(setAlcance, "Pessoal")}>Pessoal</button>
                            <button className="alcance_toque" type="button" onClick={() => selectOption(setAlcance, "Toque")}>Toque</button>
                            <button className="alcance_curto" type="button" onClick={() => selectOption(setAlcance, "Curto (9m)")}>Curto (9m)</button>
                            <button className="alcance_medio" type="button" onClick={() => selectOption(setAlcance, "Médio (18m)")}>Médio (18m)</button>
                            <button className="alcance_longo" type="button" onClick={() => selectOption(setAlcance, "Longo (36m)")}>Longo (36m)</button>
                            <button className="alcance_extremo" type="button" onClick={() => selectOption(setAlcance, "Extremo (90m)")}>Extremo (90m)</button>
                            <button className="alcance_ilimitado" type="button" onClick={() => selectOption(setAlcance, "Ilimitado")}>Ilimitado</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="div_info">
                <div className="div_area">
                    <label htmlFor="Area">Área:</label>
                    <input className="digitacao_info" type="text" name="Área" id="Area"></input>
                </div>

                <div className="div_alvo">
                    <label htmlFor="Alvo">Alvo:</label>
                    <input className="digitacao_info" type="text" name="Alvo" id="Alvo"></input>
                </div>

                <div className="div_duracao">
                    <label htmlFor="Duracao">Duração:</label>
                    <input className="digitacao_info" type="text" name="Duração" id="Duracao"></input>
                </div>

                <div className="div_efeito">
                    <label htmlFor="Efeito">Efeito:</label>
                    <input className="digitacao_info" type="text" name="Efeito" id="Efeito"></input>
                </div>

                <div className="div_dados">
                    <label htmlFor="Dados">Dados:</label>
                    <input className="digitacao_info" type="text" name="Dados" id="Dados"></input>
                </div>

                <div className="div_resistencia">
                    <label htmlFor="Resistencia">Resistência:</label>
                    <input className="digitacao_info" type="text" name="Resistência" id="Resistencia"></input>
                </div>

            </div>

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
            <button type="button" className="botao salvar" onClick={cadastrar} >
                Salvar Ritual
            </button>
        </div>
    )
}

export default Rituais;