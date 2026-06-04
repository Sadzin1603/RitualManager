import { useNavigate } from "react-router-dom";
import "./Card.css";

const elementoClasse: Record<string, string> = {
    sangue: "elemento-sangue",
    morte: "elemento-morte",
    energia: "elemento-energia",
    conhecimento: "elemento-conhecimento",
    medo: "elemento-medo",
    varia: "elemento-varia",
};

type ViewMode = "card" | "mini" | "lista";

function Card({ ritual, onConfirm, viewMode = "card" }: { ritual: any; onConfirm?: () => void; viewMode?: ViewMode }) {
    const navigate = useNavigate();
    const classeElemento = elementoClasse[ritual.element?.toLowerCase()] ?? "";

    // ─── MINI ──
    if (viewMode === "mini") {
        return (
            <div className={`${classeElemento} bg-zinc-900 rounded-xl p-3 w-auto max-w-xl mb-[20px]`}>

                {/* Nome + criador */}
                <div className="flex justify-between">
                    <h2 className="Card-nome text-lg font-bold mb-2">
                        {ritual?.name}
                    </h2>
                    <span className="text-[15px] text-zinc-500 truncate items-center flex">
                        {ritual?.creator?.name}
                    </span>
                </div>

                <div className="flex gap-3">

                    {/* Imagem */}
                    <div className="w-32 h-32 bg-zinc-800 rounded-md overflow-hidden shrink-0">
                        {ritual.img ? (
                            <img
                                src={ritual.img}
                                alt={ritual?.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                                sem imagem
                            </div>
                        )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
                            <p className="truncate">
                                <span className="info-titulo">Círculo:</span> {ritual?.circle}
                            </p>
                            <p className="truncate">
                                <span className="info-titulo">Execução:</span> {ritual?.exec}
                            </p>
                            <p className="truncate">
                                <span className="info-titulo">Alcance:</span> {ritual?.range}
                            </p>
                            <p className="truncate">
                                <span className="info-titulo">Duração:</span> {ritual?.duration}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <button
                                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-xs ml-auto text-[#fff]"
                                onClick={() => navigate(`/ritual/${ritual?.id}`)}
                            >
                                Ver mais
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── LISTA ──────────────────────────────────────────────
    if (viewMode === "lista") {
        return (
            <div className={`Card lista-card ${classeElemento}`}>

                {/* Imagem esticada no topo */}
                <div className="h-40 bg-zinc-800">
                    {ritual?.img ? (
                        <img
                            src={ritual.img}
                            alt={ritual?.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-500">
                            sem imagem
                        </div>
                    )}
                </div>

                {/* Conteúdo */}
                <div className="Conteudo">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="Card-nome text-xl font-bold">{ritual?.name}</h2>
                        <span className="text-xs text-zinc-500 pt-1">por {ritual?.creator?.name}</span>
                    </div>

                    <div className="info_ritual">
                        <p><span className="info-titulo">Círculo:</span> {ritual?.circle}</p>
                        <p><span className="info-titulo">Execução:</span> {ritual?.exec}</p>
                        <p><span className="info-titulo">Alcance:</span> {ritual?.range}</p>
                        <p><span className="info-titulo">Duração:</span> {ritual?.duration}</p>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed border-t border-zinc-700 pt-3 mt-1">
                        {ritual?.description}
                    </p>

                    <div className="flex justify-end pt-3">
                        <button
                            className="btn-ver-mais bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm"
                            onClick={() => navigate(`/ritual/${ritual?.id}`)}
                        >
                            Ver mais
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── CARD ─────────────────────────────────────
    return (
        <div className={`Card-wrapper ${classeElemento}`}>

            {/* Versão pequena (sempre visível) — no mobile navega direto */}
            <div className="Card-small" onClick={() => navigate(`/ritual/${ritual?.id}`)}>
                <div className="Card-small-header">
                    {ritual?.name}
                </div>
                <div className="Card-small-img">
                    {ritual.img ? (
                        <img src={ritual.img} alt={ritual?.name} />
                    ) : (
                        <span className="sem-imagem">sem imagem</span>
                    )}
                </div>
                <div className="Card-small-footer">
                    {ritual?.description}
                </div>
            </div>

            {/* Versão expandida (aparece no hover via CSS) */}
            <div className="Card-expandido">

                <div className="h-40 bg-zinc-800">
                    {ritual.img ? (
                        <img
                            src={ritual.img}
                            alt={ritual?.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-500">
                            sem imagem
                        </div>
                    )}
                </div>

                <div className="Conteudo">
                    <h2 className="Card-nome text-xl font-bold">{ritual?.name}</h2>

                    {onConfirm && (
                        <button className="absolute top-1 right-0 bg-[#18181B] rounded-lg p-1.5 m-2" onClick={onConfirm}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    )}

                    <div className="info_ritual">
                        <p><span className="info-titulo">Círculo:</span> {ritual?.circle}</p>
                        <p><span className="info-titulo">Execução:</span> {ritual?.exec}</p>
                        <p><span className="info-titulo">Alcance:</span> {ritual?.range}</p>
                        <p><span className="info-titulo">Duração:</span> {ritual?.duration}</p>
                    </div>

                    <p className="text-sm text-zinc-300 line-clamp-2">
                        {ritual?.description}
                    </p>

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-zinc-500">
                            Criado por: {ritual?.creator?.name}
                        </span>
                        <button
                            className="btn-ver-mais bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm"
                            onClick={() => navigate(`/ritual/${ritual?.id}`)}
                        >
                            Ver mais
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;