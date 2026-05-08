import { useRef, useState, useCallback, useEffect } from "react";
import "./Area-tela.css";

/*  CONSTS DE ÁREA TELA */

// grade em pixels (quadrado)
const CANVAS_PX = 256;
const METRO = 1.5;
const MAX_M = 30;
const INITIAL_M = 4.5;

// Tipos de forma no seletor de área
type ShapeType = "circulo" | "quadrado" | "linha" | "cone";

const mToU = (m: number) => m / METRO;
const uToM = (u: number) => u * METRO;

/* Remove casas decimais desnecessárias (ex: 3.0 → "3", 4.5 → "4.5")*/
const fmt = (m: number): string => {
    const v = parseFloat(m.toFixed(1));
    return v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
};

/* FUNÇÕES DE DESENHO NO CANVAS */

// fundo de grade quadriculada 
function drawGridBg(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    cell: number
) {
    ctx.fillStyle = "#5b8fc9";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= w; x += cell) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += cell) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
}

// icone de preview das formas
function drawPreview(canvas: HTMLCanvasElement, type: ShapeType) {
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;
    drawGridBg(ctx, w, h, 8);
    ctx.strokeStyle = "#1a2a7a";
    ctx.fillStyle = "#1a2a7a";
    ctx.lineWidth = 3;

    if (type === "circulo") {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, w * 0.35, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (type === "quadrado") {
        const m = w * 0.18;
        ctx.strokeRect(m, m, w - m * 2, h - m * 2);
    }
    if (type === "linha") {
        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.15);
        ctx.lineTo(w / 2, h * 0.85);
        ctx.stroke();
    }
    if (type === "cone") {
        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.82);
        ctx.lineTo(w * 0.18, h * 0.22);
        ctx.lineTo(w * 0.82, h * 0.22);
        ctx.closePath();
        ctx.fill();
    }
}

// tamanho de celula na grade em pixels
function getCellSize(
    activeShape: ShapeType,
    mainVal: number,
    lineW: number,
    lineH: number
): number {
    let span = 1;
    if (activeShape === "circulo") span = mainVal * 2 + 2;
    else if (activeShape === "quadrado") span = mainVal + 2;
    else if (activeShape === "cone") span = mainVal * 2 + 2;
    else if (activeShape === "linha") span = Math.max(lineW, lineH) + 2;
    return Math.min(20, Math.max(3, CANVAS_PX / span));
}

// forma ativa no canvas principal
function drawGrade(
    ctx: CanvasRenderingContext2D,
    activeShape: ShapeType,
    mainVal: number,
    lineW: number,
    lineH: number
) {
    const w = CANVAS_PX, h = CANVAS_PX;
    const cell = getCellSize(activeShape, mainVal, lineW, lineH);
    drawGridBg(ctx, w, h, cell);

    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = "#1a2a7a";
    ctx.fillStyle = "rgba(26,42,122,0.22)";
    ctx.lineWidth = 2.5;

    if (activeShape === "circulo") {
        const r = mainVal * cell;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
    }
    if (activeShape === "quadrado") {
        const s = mainVal * cell;
        ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
        ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
    }
    if (activeShape === "linha") {
        const pw = lineW * cell, ph = lineH * cell;
        ctx.fillRect(cx - pw / 2, cy - ph / 2, pw, ph);
        ctx.strokeRect(cx - pw / 2, cy - ph / 2, pw, ph);
    }
    if (activeShape === "cone") {
        const s = mainVal * cell;
        ctx.beginPath();
        ctx.moveTo(cx, cy + s); ctx.lineTo(cx - s, cy - s); ctx.lineTo(cx + s, cy - s);
        ctx.closePath(); ctx.fill(); ctx.stroke();
    }
}

// descrição no input da área selecionada 
function getLabel(
    activeShape: ShapeType,
    mainVal: number,
    lineW: number,
    lineH: number
): string {
    if (activeShape === "circulo") return `Raio de ${fmt(uToM(mainVal))}m`;
    if (activeShape === "quadrado") return `Cubo de ${fmt(uToM(mainVal))}m`;
    if (activeShape === "cone") return `Cone de ${fmt(uToM(mainVal))}m`;
    if (activeShape === "linha") {
        const hm = fmt(uToM(lineH));
        const wm = fmt(uToM(lineW));
        if (lineW <= 1) return `Reta de ${hm}m`;
        return `Reta de ${hm}m de altura por ${wm}m de largura`;
    }
    return "";
}

// COMPONENTE: AreaSelector

export interface AreaSelectorProps {
    value: string;
    onChange: (label: string) => void;
}

/*
Fluxo de uso:
1. Clica no input → abre o grid de formas (círculo, quadrado, linha, cone)
2. Clica em uma forma → abre o editor com canvas interativo
3. Arrasta as bordas da forma no canvas para mudar o tamanho
4. Clica "Confirmar" → o label é gerado e salvo no input
*/
export function AreaSelector({ value, onChange }: AreaSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeShape, setActiveShape] = useState<ShapeType | null>(null);

    const [mainVal, setMainVal] = useState(mToU(INITIAL_M));
    const [lineW, setLineW] = useState(1);
    const [lineH, setLineH] = useState(mToU(INITIAL_M));

    const [dragging, setDragging] = useState(false);
    const [dragEdge, setDragEdge] = useState<string | null>(null);
    const [dragStartVal, setDragStartVal] = useState(0);

    const gradeCanvasRef = useRef<HTMLCanvasElement>(null);
    const prevCirculoRef = useRef<HTMLCanvasElement>(null);
    const prevQuadradoRef = useRef<HTMLCanvasElement>(null);
    const prevLinhaRef = useRef<HTMLCanvasElement>(null);
    const prevConeRef = useRef<HTMLCanvasElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const [mInputVal, setMInputVal] = useState(fmt(INITIAL_M));

    // EFEITO: Desenha os previews quando o grid de formas está visível.
    useEffect(() => {
        if (!isOpen || activeShape) return;
        const id = requestAnimationFrame(() => {
            if (prevCirculoRef.current) drawPreview(prevCirculoRef.current, "circulo");
            if (prevQuadradoRef.current) drawPreview(prevQuadradoRef.current, "quadrado");
            if (prevLinhaRef.current) drawPreview(prevLinhaRef.current, "linha");
            if (prevConeRef.current) drawPreview(prevConeRef.current, "cone");
        });
        return () => cancelAnimationFrame(id);
    }, [isOpen, activeShape]);

    // EFEITO: Re-desenha o canvas principal toda vez que os valores mudam
    useEffect(() => {
        if (!activeShape || !gradeCanvasRef.current) return;
        const ctx = gradeCanvasRef.current.getContext("2d")!;
        drawGrade(ctx, activeShape, mainVal, lineW, lineH);
        const mVal = activeShape === "linha" ? uToM(lineH) : uToM(mainVal);
        setMInputVal(fmt(mVal));
    }, [activeShape, mainVal, lineW, lineH]);

    // EFEITO: Fecha o painel ao clicar fora dele
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                panelRef.current &&
                !panelRef.current.contains(e.target as Node) &&
                e.target !== inputRef.current
            ) {
                closePanel();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // EFEITO: Gerencia os eventos de mousemove/mouseup globais.
    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!activeShape || !gradeCanvasRef.current) return;

            const canvas = gradeCanvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const sx = CANVAS_PX / rect.width;
            const sy = CANVAS_PX / rect.height;
            const mx = (e.clientX - rect.left) * sx;
            const my = (e.clientY - rect.top) * sy;

            const cx = CANVAS_PX / 2, cy = CANVAS_PX / 2;
            const cell = getCellSize(activeShape, mainVal, lineW, lineH);
            const half = CANVAS_PX / 2;
            const isHoriz = dragEdge === "right" || dragEdge === "left";

            const rawPx = isHoriz ? Math.abs(mx - cx) : Math.abs(my - cy);

            let rawUnits: number;
            if (activeShape === "circulo" || activeShape === "cone") {
                rawUnits = rawPx / cell;
            } else {
                rawUnits = (rawPx / cell) * 2;
            }

            // Resistência progressiva ao ultrapassar a borda do canvas.
            // Quanto mais o mouse sai do canvas, mais lento o valor cresce.
            // Isso impede que o usuário "estoure" o limite com movimentos rápidos.
            const overflow = Math.max(0, rawPx - half);
            const resistance = 1 + overflow * 0.07;
            const dampedUnits = dragStartVal + (rawUnits - dragStartVal) / resistance;

            // Clampamos entre 1 unidade e o máximo permitido, arredondando para inteiro
            const maxU = MAX_M / METRO;
            const snapped = Math.max(1, Math.min(maxU, Math.round(dampedUnits)));

            if (activeShape === "linha") {
                if (isHoriz) setLineW(snapped);
                else setLineH(snapped);
            } else {
                setMainVal(snapped);
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            setDragEdge(null);
            if (gradeCanvasRef.current) {
                gradeCanvasRef.current.style.cursor = "default";
            }
            if (activeShape) {
                onChange(getLabel(activeShape, mainVal, lineW, lineH));
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, dragEdge, dragStartVal, activeShape, mainVal, lineW, lineH]);

    const getEdge = useCallback((
        e: React.MouseEvent<HTMLCanvasElement>
    ): { edge: string; cursor: string } | null => {
        if (!activeShape || !gradeCanvasRef.current) return null;

        const canvas = gradeCanvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const sx = CANVAS_PX / rect.width, sy = CANVAS_PX / rect.height;
        const mx = (e.clientX - rect.left) * sx;
        const my = (e.clientY - rect.top) * sy;

        const cx = CANVAS_PX / 2, cy = CANVAS_PX / 2;
        const cell = getCellSize(activeShape, mainVal, lineW, lineH);
        const T = Math.max(10, cell * 0.7);

        if (activeShape === "circulo") {
            const r = mainVal * cell;
            const dx = mx - cx, dy = my - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(dist - r) < T) {
                const ang = Math.atan2(dy, dx) * 180 / Math.PI;
                if (ang > -45 && ang <= 45) return { edge: "right", cursor: "e-resize" };
                if (ang > 45 && ang <= 135) return { edge: "bottom", cursor: "s-resize" };
                if (ang > 135 || ang <= -135) return { edge: "left", cursor: "w-resize" };
                return { edge: "top", cursor: "n-resize" };
            }
            return null;
        }

        if (activeShape === "quadrado") {
            const s = mainVal * cell;
            const x0 = cx - s / 2, x1 = cx + s / 2, y0 = cy - s / 2, y1 = cy + s / 2;
            const dL = Math.abs(mx - x0), dR = Math.abs(mx - x1);
            const dT = Math.abs(my - y0), dB = Math.abs(my - y1);
            const minD = Math.min(dL, dR, dT, dB);
            if (minD > T || !(mx >= x0 - T && mx <= x1 + T && my >= y0 - T && my <= y1 + T)) return null;
            if (minD === dR) return { edge: "right", cursor: "e-resize" };
            if (minD === dL) return { edge: "left", cursor: "w-resize" };
            if (minD === dB) return { edge: "bottom", cursor: "s-resize" };
            return { edge: "top", cursor: "n-resize" };
        }

        if (activeShape === "linha") {
            const pw = lineW * cell, ph = lineH * cell;
            const x0 = cx - pw / 2, x1 = cx + pw / 2, y0 = cy - ph / 2, y1 = cy + ph / 2;
            const dL = Math.abs(mx - x0), dR = Math.abs(mx - x1);
            const dT = Math.abs(my - y0), dB = Math.abs(my - y1);
            const minD = Math.min(dL, dR, dT, dB);
            if (minD > T || !(mx >= x0 - T && mx <= x1 + T && my >= y0 - T && my <= y1 + T)) return null;
            if (minD === dR) return { edge: "right", cursor: "e-resize" };
            if (minD === dL) return { edge: "left", cursor: "w-resize" };
            if (minD === dB) return { edge: "bottom", cursor: "s-resize" };
            return { edge: "top", cursor: "n-resize" };
        }

        if (activeShape === "cone") {
            const s = mainVal * cell;
            const dR = Math.abs(mx - (cx + s)), dL = Math.abs(mx - (cx - s));
            const dT = Math.abs(my - (cy - s)), dB = Math.abs(my - (cy + s));
            const minD = Math.min(dR, dL, dT, dB);
            if (minD === dT && minD < T) return { edge: "top", cursor: "n-resize" };
            if (minD === dB && minD < T) return { edge: "bottom", cursor: "s-resize" };
        }

        return null;
    }, [activeShape, mainVal, lineW, lineH]);

    /* HANDLERS DO CANVAS */

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (dragging) return;
        const info = getEdge(e);
        if (gradeCanvasRef.current) {
            gradeCanvasRef.current.style.cursor = info ? info.cursor : "default";
        }
    };

    const handleCanvasMouseLeave = () => {
        if (!dragging && gradeCanvasRef.current) {
            gradeCanvasRef.current.style.cursor = "default";
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const info = getEdge(e);
        if (!info) return;

        const startVal = activeShape === "linha"
            ? (info.edge === "right" || info.edge === "left" ? lineW : lineH)
            : mainVal;

        setDragging(true);
        setDragEdge(info.edge);
        setDragStartVal(startVal);
        e.preventDefault();
    };

    // HANDLERS DE AÇÃO DO PAINEL

    // Abre o editor para a forma selecionada, resetando os valores iniciais
    const openEditor = (shape: ShapeType) => {
        setActiveShape(shape);
        setMainVal(mToU(INITIAL_M));
        setLineW(1);
        setLineH(mToU(INITIAL_M));
    };

    // Confirma a seleção e fecha o painel, emitindo o label gerado
    const confirmSelection = () => {
        if (!activeShape) return;
        const label = getLabel(activeShape, mainVal, lineW, lineH);
        onChange(label);
        closePanel();
    };

    // Fecha o painel e reseta o estado interno
    const closePanel = () => {
        setIsOpen(false);
        setActiveShape(null);
        setDragging(false);
        setDragEdge(null);
    };

    // Abre o painel mostrando o grid de formas
    const openPanel = () => {
        setIsOpen(true);
        setActiveShape(null);
    };

    // Aplica o valor colocado em metros na forma, arredondando para um num aceito 
    // e manda o valor para o input automaticamente
    const applyMetros = useCallback((raw: number) => {
        if (isNaN(raw)) return;
        const rounded = Math.round(raw / METRO) * METRO;
        const clamped = Math.max(METRO, Math.min(MAX_M, rounded));
        const u = Math.max(1, Math.round(mToU(clamped)));
        if (activeShape === "linha") setLineH(u);
        else setMainVal(u);
        setMInputVal(fmt(clamped));
        if (activeShape) {
            const newLineH = activeShape === "linha" ? u : lineH;
            const newMainVal = activeShape !== "linha" ? u : mainVal;
            onChange(getLabel(activeShape, newMainVal, lineW, newLineH));
        }
    }, [activeShape, lineH, lineW, mainVal, onChange]);

    const handleMInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMInputVal(e.target.value);
    };

    const handleMInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        applyMetros(parseFloat(e.target.value));
    };

    // Seta cima: +METRO
    const stepUp = () => {
        const cur = activeShape === "linha" ? uToM(lineH) : uToM(mainVal);
        applyMetros(cur + METRO);
    };

    // Seta baixo: -METRO
    const stepDown = () => {
        const cur = activeShape === "linha" ? uToM(lineH) : uToM(mainVal);
        applyMetros(cur - METRO);
    };

    // RENDER
    return (
        <div className="area-selector-wrap">
            {/* Input principal — ao clicar, abre o painel de seleção */}
            <input
                ref={inputRef}
                className="digitacao_info area-selector-input"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button
                className="area-open-btn"
                type="button"
                onClick={() => (isOpen ? closePanel() : openPanel())}
                aria-label="Abrir seletor de área"
            >▦</button>

            {/* Painel flutuante: grid de formas ou editor de tamanho */}
            {isOpen && (
                <div className="area-tela" ref={panelRef}>

                    {/* GRID DE SELEÇÃO DE FORMA */}
                    {!activeShape && (
                        <div className="area-shapes-grid">
                            <button
                                className="area-shape-btn"
                                type="button"
                                onClick={() => openEditor("circulo")}
                            >
                                <canvas ref={prevCirculoRef} width={110} height={110} />
                            </button>
                            <button
                                className="area-shape-btn"
                                type="button"
                                onClick={() => openEditor("quadrado")}
                            >
                                <canvas ref={prevQuadradoRef} width={110} height={110} />
                            </button>
                            <button
                                className="area-shape-btn"
                                type="button"
                                onClick={() => openEditor("linha")}
                            >
                                <canvas ref={prevLinhaRef} width={110} height={110} />
                            </button>
                            <button
                                className="area-shape-btn"
                                type="button"
                                onClick={() => openEditor("cone")}
                            >
                                <canvas ref={prevConeRef} width={110} height={110} />
                            </button>
                        </div>
                    )}

                    {/*EDITOR DE TAMANHO*/}
                    {activeShape && (
                        <div className="area-editor-panel">
                            { }
                            <div className="area-grade-row">
                                <div className="area-grade-wrap">
                                    <canvas
                                        ref={gradeCanvasRef}
                                        className="area-grade-canvas"
                                        width={CANVAS_PX}
                                        height={CANVAS_PX}
                                        onMouseMove={handleCanvasMouseMove}
                                        onMouseLeave={handleCanvasMouseLeave}
                                        onMouseDown={handleCanvasMouseDown}
                                    />
                                </div>
                                { }
                            </div>

                            {/* botão confirmar + input de metros */}
                            <div className="area-bottom-row">
                                <button
                                    className="area-confirmar-btn"
                                    type="button"
                                    onClick={confirmSelection}
                                >
                                    Confirmar
                                </button>
                                <div className="area-m-input-wrap">
                                    <input
                                        className="area-m-input"
                                        type="text"
                                        inputMode="decimal"
                                        value={mInputVal}
                                        onChange={handleMInput}
                                        onBlur={handleMInputBlur}
                                    />
                                    <div className="area-m-arrows">
                                        <button
                                            className="area-m-arrow"
                                            type="button"
                                            onClick={stepUp}
                                            aria-label="Aumentar metros"
                                        >▲</button>
                                        <button
                                            className="area-m-arrow"
                                            type="button"
                                            onClick={stepDown}
                                            aria-label="Diminuir metros"
                                        >▼</button>
                                    </div>
                                    <span className="area-m-label">m</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AreaSelector;