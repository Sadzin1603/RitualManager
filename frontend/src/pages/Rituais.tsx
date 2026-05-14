import { ChangeEvent, useRef, useState, useCallback, useEffect } from "react";
import "./Rituais.css";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { AreaSelector } from "./Area-tela.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JwtPayload {
    id: string;
}

interface RitualState {
    id: string;
    name: string;
    img: string;
    element: string;
    circle: string;
    exec: string;
    range: string;
    duration: string;
    area: string;
    target: string;
    effect: string;
    resistence: string;
    dices: string;
    description: string;
    discent_description: string;
    truly_description: string;
    discent_dices: string;
    truly_dices: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CIRCULO_CLASSE: Record<string, string> = {
    "1° Circulo (1 PE)": "circulo_1",
    "2° Circulo (3 PE)": "circulo_2",
    "3° Circulo (6 PE)": "circulo_3",
    "4° Circulo (10 PE)": "circulo_4",
};

const CIRCULO_TEXT: Record<string, string> = {
    "1° Circulo (1 PE)": "1°",
    "2° Circulo (3 PE)": "2°",
    "3° Circulo (6 PE)": "3°",
    "4° Circulo (10 PE)": "4°",
};

const EXECUCAO_CLASSE: Record<string, string> = {
    "Padrão": "execucao_padrao",
    "Movimento": "execucao_movimento",
    "Completa": "execucao_completa",
    "Reação": "execucao_reacao",
    "Livre": "execucao_livre",
};

const ALCANCE_CLASSE: Record<string, string> = {
    "Pessoal": "alcance_pessoal",
    "Toque": "alcance_toque",
    "Curto (9m)": "alcance_curto",
    "Médio (18m)": "alcance_medio",
    "Longo (36m)": "alcance_longo",
    "Extremo (90m)": "alcance_extremo",
    "Ilimitado": "alcance_ilimitado",
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.round(crop.width * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
        image,
        crop.x * scaleX, crop.y * scaleY,
        crop.width * scaleX, crop.height * scaleY,
        0, 0,
        canvas.width, canvas.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error("Falha ao gerar blob")),
            "image/jpeg",
        );
    });
}

// ─── Dropdown component ───────────────────────────────────────────────────────

interface DropdownOption {
    label: string;
    value: string;
    className?: string;
}

interface DropdownProps {
    id: string;
    label: string;
    value: string;
    options: DropdownOption[];
    isOpen: boolean;
    isInvalid?: boolean;
    buttonClassName?: string;
    onToggle: () => void;
    onSelect: (value: string) => void;
}

function Dropdown({
    id, label, value, options, isOpen, isInvalid, buttonClassName = "",
    onToggle, onSelect,
}: DropdownProps) {
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <div style={{ position: "relative" }}>
                <button
                    id={id}
                    className={`botao_lista ${buttonClassName} ${isInvalid ? "campo-invalido" : ""}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`lista_${id.toLowerCase()}`}
                    onClick={onToggle}
                >
                    {value}
                </button>
                <div
                    id={`lista_${id.toLowerCase()}`}
                    className={`lista lista_${id.toLowerCase()} ${isOpen ? "show" : ""}`}
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={opt.className}
                            type="button"
                            onClick={() => onSelect(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

function Rituais() {
    const uploadRef = useRef<HTMLInputElement | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Controlled form fields
    const [name, setName] = useState("");
    const [elemento, setElemento] = useState("Elemento");
    const [circulo, setCirculo] = useState("Circulo");
    const [execucao, setExecucao] = useState("Execução");
    const [alcance, setAlcance] = useState("Alcance");
    const [alvoInput, setAlvoInput] = useState("");
    const [duracaoInput, setDuracaoInput] = useState("");
    const [area, setArea] = useState("");

    // Uncontrolled fields via refs (previously accessed via getElementById)
    const efeitoRef = useRef<HTMLInputElement>(null);
    const resistenciaRef = useRef<HTMLInputElement>(null);
    const dadosRef = useRef<HTMLInputElement>(null);
    const descricaoRef = useRef<HTMLTextAreaElement>(null);
    const dadosDiscenteRef = useRef<HTMLInputElement>(null);
    const descricaoDiscenteRef = useRef<HTMLTextAreaElement>(null);
    const dadosVerdadeiroRef = useRef<HTMLInputElement>(null);
    const descricaoVerdadeiroRef = useRef<HTMLTextAreaElement>(null);

    // Image state
    const [img, setImg] = useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = useState("");
    const [modalSrc, setModalSrc] = useState("");
    const [originalSrc, setOriginalSrc] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    // Dropdown
    const [openList, setOpenList] = useState<string | null>(null);

    // Validation
    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);

    // Ritual being edited (from navigation state)
    const ritualState: RitualState | null = location.state ?? null;
    const isEditing = Boolean(ritualState?.id);

    // Populate form when editing
    useEffect(() => {
        if (!ritualState) return;

        setName(ritualState.name ?? "");
        setPreviewSrc(ritualState.img ?? "");
        setElemento(ritualState.element ?? "Elemento");
        setCirculo(ritualState.circle ?? "Circulo");
        setExecucao(ritualState.exec ?? "Execução");
        setAlcance(ritualState.range ?? "Alcance");
        setDuracaoInput(ritualState.duration ?? "");
        setArea(ritualState.area ?? "");
        setAlvoInput(ritualState.target ?? "");

        // Populate refs after render
        setTimeout(() => {
            if (efeitoRef.current) efeitoRef.current.value = ritualState.effect ?? "";
            if (resistenciaRef.current) resistenciaRef.current.value = ritualState.resistence ?? "";
            if (dadosRef.current) dadosRef.current.value = ritualState.dices ?? "";
            if (descricaoRef.current) descricaoRef.current.value = ritualState.description ?? "";
            if (dadosDiscenteRef.current) dadosDiscenteRef.current.value = ritualState.discent_dices ?? "";
            if (descricaoDiscenteRef.current) descricaoDiscenteRef.current.value = ritualState.discent_description ?? "";
            if (dadosVerdadeiroRef.current) dadosVerdadeiroRef.current.value = ritualState.truly_dices ?? "";
            if (descricaoVerdadeiroRef.current) descricaoVerdadeiroRef.current.value = ritualState.truly_description ?? "";
        }, 0);
    }, []);

    // ── Validation helpers ──────────────────────────────────────────────────────

    const inv = (campo: string) => camposInvalidos.includes(campo);
    const limparCampo = (campo: string) => setCamposInvalidos((prev) => prev.filter((c) => c !== campo));

    // ── Image handlers ──────────────────────────────────────────────────────────

    const handleChooseClick = () => {
        if (uploadRef.current) uploadRef.current.value = "";
        uploadRef.current?.click();
    };

    const handlePreviewClick = () => {
        if (!originalSrc) { uploadRef.current?.click(); return; }
        setModalSrc(`${originalSrc}#${Date.now()}`);
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
            setModalSrc(`${src}#${Date.now()}`);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setShowModal(true);
        };
        reader.readAsDataURL(file);
    };

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 80 }, 1, width, height), width, height));
    }, []);

    const handleConfirm = async () => {
        if (!completedCrop || !imgRef.current) return;
        const blob = await getCroppedImg(imgRef.current, completedCrop);
        setPreviewSrc(URL.createObjectURL(blob));
        setImg(new File([blob], "ritual_img.jpg", { type: "image/jpeg" }));
        setShowModal(false);
    };

    // ── Dropdown handlers ───────────────────────────────────────────────────────

    const toggleList = (listName: string) => setOpenList((c) => (c === listName ? null : listName));

    const selectOption = (setter: (v: string) => void, value: string, campo?: string) => {
        setter(value);
        setOpenList(null);
        if (campo) limparCampo(campo);
    };

    // ── Submit ──────────────────────────────────────────────────────────────────

    async function cadastrar() {
        // ── EDIT mode ──
        if (isEditing && ritualState) {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("element", elemento);
            formData.append("circle", CIRCULO_TEXT[circulo] ?? circulo);
            formData.append("exec", execucao);
            formData.append("range", alcance);
            formData.append("duration", duracaoInput);
            formData.append("area", area);
            formData.append("target", alvoInput);
            formData.append("effect", efeitoRef.current?.value ?? "");
            formData.append("resistence", resistenciaRef.current?.value ?? "");
            formData.append("dices", dadosRef.current?.value ?? "");
            formData.append("description", descricaoRef.current?.value ?? "");
            formData.append("discent_description", descricaoDiscenteRef.current?.value ?? "");
            formData.append("truly_description", descricaoVerdadeiroRef.current?.value ?? "");
            formData.append("discent_dices", dadosDiscenteRef.current?.value ?? "");
            formData.append("truly_dices", dadosVerdadeiroRef.current?.value ?? "");
            formData.append("status", "pendente");
            if (img) formData.append("file", img);

            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:3000/ritual/${ritualState.id}`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,                // ← antes passava {ritual} (objeto literal, inválido)
                });
                console.log("sa")
                if (!res.ok) throw new Error(`Erro ${res.status}`);
                navigate("/principal");
            } catch (err) {
                console.error("Erro ao editar ritual:", err);
            }
            return;
        }

        // ── CREATE mode ──
        const token = localStorage.getItem("token");
        if (!token) return;

        const descricao = descricaoRef.current?.value ?? "";

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

        const decoded = jwtDecode<JwtPayload>(token);
        const formData = new FormData();

        formData.append("name", name);
        formData.append("file", img);
        formData.append("element", elemento);
        formData.append("circle", CIRCULO_TEXT[circulo]);
        formData.append("exec", execucao);
        formData.append("range", alcance);
        formData.append("duration", duracaoInput);
        formData.append("area", area);
        formData.append("target", alvoInput);
        formData.append("effect", efeitoRef.current?.value ?? "");
        formData.append("resistence", resistenciaRef.current?.value ?? "");
        formData.append("dices", dadosRef.current?.value ?? "");
        formData.append("description", descricao);

        const discente = (document.getElementById("DescricaoDiscente") as HTMLTextAreaElement).value;
        const verdadeiro = (document.getElementById("DescricaoVerdadeiro") as HTMLTextAreaElement).value;
        formData.append("discent_description", discente === "Discente (+2PE): " ? "" : discente);
        formData.append("truly_description", verdadeiro === "Verdadeiro (+5PE): " ? "" : verdadeiro);

        formData.append("discent_dices", dadosDiscenteRef.current?.value ?? "");
        formData.append("truly_dices", dadosVerdadeiroRef.current?.value ?? "");
        formData.append("creator", decoded.id);

        try {
            const res = await fetch("http://localhost:3000/ritual", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            navigate("/principal");
        } catch (err) {
            console.error("Erro ao criar ritual:", err);
        }
    }

    // ── Dropdown option lists ───────────────────────────────────────────────────

    const elementoOptions: DropdownOption[] = [
        { label: "Sangue", value: "Sangue", className: "elemento_sangue" },
        { label: "Morte", value: "Morte", className: "elemento_morte" },
        { label: "Conhecimento", value: "Conhecimento", className: "elemento_conhecimento" },
        { label: "Energia", value: "Energia", className: "elemento_energia" },
        { label: "Medo", value: "Medo", className: "elemento_medo" },
        { label: "Varia", value: "Varia", className: "elemento_varia" },
    ];

    const circuloOptions: DropdownOption[] = [
        { label: "1° Circulo (1 PE)", value: "1° Circulo (1 PE)", className: "circulo_1" },
        { label: "2° Circulo (3 PE)", value: "2° Circulo (3 PE)", className: "circulo_2" },
        { label: "3° Circulo (6 PE)", value: "3° Circulo (6 PE)", className: "circulo_3" },
        { label: "4° Circulo (10 PE)", value: "4° Circulo (10 PE)", className: "circulo_4" },
    ];

    const execucaoOptions: DropdownOption[] = [
        { label: "Completa", value: "Completa", className: "execucao_completa" },
        { label: "Padrão", value: "Padrão", className: "execucao_padrao" },
        { label: "Movimento", value: "Movimento", className: "execucao_movimento" },
        { label: "Reação", value: "Reação", className: "execucao_reacao" },
        { label: "Livre", value: "Livre", className: "execucao_livre" },
    ];

    const alcanceOptions: DropdownOption[] = [
        { label: "Pessoal", value: "Pessoal", className: "alcance_pessoal" },
        { label: "Toque", value: "Toque", className: "alcance_toque" },
        { label: "Curto (9m)", value: "Curto (9m)", className: "alcance_curto" },
        { label: "Médio (18m)", value: "Médio (18m)", className: "alcance_medio" },
        { label: "Longo (36m)", value: "Longo (36m)", className: "alcance_longo" },
        { label: "Extremo (90m)", value: "Extremo (90m)", className: "alcance_extremo" },
        { label: "Ilimitado", value: "Ilimitado", className: "alcance_ilimitado" },
    ];

    const alvoOptions: DropdownOption[] = [
        { label: "1 Pessoa", value: "1 Pessoa", className: "alvo_pessoal" },
        { label: "1 Ser", value: "1 Ser", className: "alvo_toque" },
        { label: "1 Objeto", value: "1 Objeto", className: "alvo_curto" },
        { label: "1 Arma Corpo a Corpo", value: "1 Arma Corpo a Corpo", className: "alvo_medio" },
        { label: "1 Arma de Fogo", value: "1 Arma de Fogo", className: "alvo_longo" },
        { label: "1 Arma", value: "1 Arma", className: "alvo_extremo" },
        { label: "2 Seres Escolhidos", value: "2 Seres Escolhidos", className: "alvo_ilimitado" },
        { label: "Seres na Área", value: "Seres na Área", className: "alvo_area" },
    ];

    const duracaoOptions: DropdownOption[] = [
        { label: "Cena", value: "Cena", className: "alvo_pessoal" },
        { label: "Instantânea", value: "Instantânea", className: "alvo_toque" },
        { label: "Sustentada", value: "Sustentada", className: "alvo_curto" },
        { label: "1 Rodada", value: "1 Rodada", className: "alvo_medio" },
        { label: "1 Dia", value: "1 Dia", className: "alvo_longo" },
    ];

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="editor editor_principal">

            {/* NOME */}
            <div className="formulario_edicao">
                <label htmlFor="Nome">Nome:</label>
                <input
                    className={`digitacao ${inv("nome") ? "campo-invalido" : ""}`}
                    type="text"
                    name="Nome"
                    id="Nome"
                    value={name}
                    onChange={(e) => { setName(e.target.value); limparCampo("nome"); }}
                />
            </div>

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

                    <div
                        className="preview"
                        role="button"
                        tabIndex={0}
                        aria-label="Recortar imagem"
                        onClick={handlePreviewClick}
                        onKeyDown={(e) => e.key === "Enter" && handlePreviewClick()}
                    >
                        {previewSrc && (
                            <img className="preview_img" src={previewSrc} alt="Pré-visualização" style={{ objectFit: "cover" }} />
                        )}
                    </div>

                    {/* Modal de recorte */}
                    {showModal && (
                        <div id="crop-modal" className="modal show" role="dialog" aria-modal="true" aria-label="Recortar imagem">
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
                                <button type="button" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* DROPDOWNS */}
                <div className="div_dropdowns">
                    <Dropdown
                        id="Elemento"
                        label="Elemento:"
                        value={elemento}
                        options={elementoOptions}
                        isOpen={openList === "elemento"}
                        isInvalid={inv("elemento")}
                        buttonClassName={elemento !== "Elemento" ? `elemento_${elemento.toLowerCase()}` : ""}
                        onToggle={() => toggleList("elemento")}
                        onSelect={(v) => selectOption(setElemento, v, "elemento")}
                    />

                    <Dropdown
                        id="Circulo"
                        label="Círculo:"
                        value={circulo}
                        options={circuloOptions}
                        isOpen={openList === "circulo"}
                        isInvalid={inv("circulo")}
                        buttonClassName={CIRCULO_CLASSE[circulo] ?? ""}
                        onToggle={() => toggleList("circulo")}
                        onSelect={(v) => selectOption(setCirculo, v, "circulo")}
                    />

                    <Dropdown
                        id="Execucao"
                        label="Execução:"
                        value={execucao}
                        options={execucaoOptions}
                        isOpen={openList === "execucao"}
                        isInvalid={inv("execucao")}
                        buttonClassName={EXECUCAO_CLASSE[execucao] ?? ""}
                        onToggle={() => toggleList("execucao")}
                        onSelect={(v) => selectOption(setExecucao, v, "execucao")}
                    />

                    <Dropdown
                        id="Alcance"
                        label="Alcance:"
                        value={alcance}
                        options={alcanceOptions}
                        isOpen={openList === "alcance"}
                        isInvalid={inv("alcance")}
                        buttonClassName={ALCANCE_CLASSE[alcance] ?? ""}
                        onToggle={() => toggleList("alcance")}
                        onSelect={(v) => selectOption(setAlcance, v, "alcance")}
                    />
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
                    <input ref={efeitoRef} className="digitacao_info" type="text" name="Efeito" id="Efeito" />
                </div>

                {/* Alvo com dropdown */}
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
                            aria-label="Selecionar alvo"
                            aria-expanded={openList === "alvo"}
                            aria-controls="lista_alvo"
                            onClick={() => toggleList("alvo")}
                        >
                            ∨
                        </button>
                    </div>
                    <div id="lista_alvo" className={`lista lista_alvo ${openList === "alvo" ? "show" : ""}`}>
                        {alvoOptions.map((opt) => (
                            <button
                                key={opt.value}
                                className={opt.className}
                                type="button"
                                onClick={() => { setAlvoInput(opt.value); setOpenList(null); }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duração com dropdown */}
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
                            aria-label="Selecionar duração"
                            aria-expanded={openList === "duracao"}
                            aria-controls="lista_duracao"
                            onClick={() => toggleList("duracao")}
                        >
                            ∨
                        </button>
                    </div>
                    <div id="lista_duracao" className={`lista lista_duracao ${openList === "duracao" ? "show" : ""}`}>
                        {duracaoOptions.map((opt) => (
                            <button
                                key={opt.value}
                                className={opt.className}
                                type="button"
                                onClick={() => { setDuracaoInput(opt.value); setOpenList(null); limparCampo("duracao"); }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="info div_dados">
                    <label htmlFor="Dados">Dados:</label>
                    <input ref={dadosRef} className="digitacao_info" type="text" name="Dados" id="Dados" placeholder="Ex: 2d6+5" />
                </div>

                <div className="info div_resistencia">
                    <label htmlFor="Resistencia">Resistência:</label>
                    <input ref={resistenciaRef} className="digitacao_info" type="text" name="Resistência" id="Resistencia" placeholder="Ex: Fortitude (DT 18)" />
                </div>

                {/* TEXTOS LONGOS */}
            </div> {/* fecha div_info */}

            <label htmlFor="Descricao">Descrição:</label>
            <textarea
                ref={descricaoRef}
                className={`digitacao ${inv("descricao") ? "campo-invalido" : ""}`}
                name="Descrição"
                id="Descricao"
                onChange={() => limparCampo("descricao")}
            />

            <label htmlFor="DadosDiscente">Dados Discente:</label>
            <input ref={dadosDiscenteRef} className="digitacao" type="text" name="DadosDiscente" id="DadosDiscente" />

            <label htmlFor="DescricaoDiscente">Descrição Discente:</label>
            <textarea ref={descricaoDiscenteRef} className="digitacao" name="DescriçãoDiscente" id="DescricaoDiscente" defaultValue="Discente (+2PE): " />

            <label htmlFor="DadosVerdadeiro">Dados Verdadeiro:</label>
            <input ref={dadosVerdadeiroRef} className="digitacao" type="text" name="DadosVerdadeiro" id="DadosVerdadeiro" />

            <label htmlFor="DescricaoVerdadeiro">Descrição Verdadeiro:</label>
            <textarea ref={descricaoVerdadeiroRef} className="digitacao" name="DescriçãoVerdadeiro" id="DescricaoVerdadeiro" defaultValue="Verdadeiro (+5PE): " />

            <button type="button" className="botao salvar" onClick={cadastrar}>
                {isEditing ? "Salvar Alterações" : "Salvar Ritual"}
            </button>
        </div>
    );
}

export default Rituais;