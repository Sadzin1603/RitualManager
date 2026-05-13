import { useNavigate } from "react-router-dom";
import "./Card.css";

const elementoClasse: Record<string, string> = {
    sangue:       "elemento-sangue",
    morte:        "elemento-morte",
    energia:      "elemento-energia",
    conhecimento: "elemento-conhecimento",
    medo:         "elemento-medo",
    varia:        "elemento-varia",
};

function MiniCard({ ritual }) {
    const navigate = useNavigate();
    const classeElemento = elementoClasse[ritual.element?.toLowerCase()] ?? "";

    return (
        <div className={`${classeElemento} bg-zinc-900 rounded-xl p-3 w-full max-w-xl mb-[20px]`}>

            {/* Nome */}
            <div className="flex justify-between">
                <h2 className="Card-nome text-lg font-bold mb-2">
                    {ritual.name}
                </h2>
                <span className="text-[15px] text-zinc-500 truncate items-center flex">
                    {ritual.creator.name}
                </span>
            </div>

            <div className="flex gap-3">

                {/* IMAGEM */}
                <div className="w-32 h-32 bg-zinc-800 rounded-md overflow-hidden shrink-0">
                    {ritual.img ? (
                        <img
                            src={ritual.img}
                            alt={ritual.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-500 text-xs">
                            sem imagem
                        </div>
                    )}
                </div>

                {/* INFOS */}
                <div className="flex-1 flex flex-col justify-between min-w-0">

                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm">
                        <p className="truncate">
                            <span className="info-titulo">Círculo:</span>{" "}
                            {ritual.circle}
                        </p>
                        <p className="truncate">
                            <span className="info-titulo">Execução:</span>{" "}
                            {ritual.exec}
                        </p>
                        <p className="truncate">
                            <span className="info-titulo">Alcance:</span>{" "}
                            {ritual.range}
                        </p>
                        <p className="truncate">
                            <span className="info-titulo">Duração:</span>{" "}
                            {ritual.duration}
                        </p>
                    </div>

                    <div className="flex justify-end items-center mt-2">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-xs"
                            onClick={() => navigate(`/ritual/${ritual.id}`)}
                        >
                            Ver mais
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MiniCard;