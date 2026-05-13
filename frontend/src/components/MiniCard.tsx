import { useNavigate } from "react-router-dom";

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
        <div className={`${classeElemento} bg-zinc-900 border border-red-700 rounded-xl p-3 w-full max-w-xl`}>

            {/* Nome */}
            <h2 className="Card-nome text-lg font-bold mb-2 text-red-500">
                {ritual.name}
            </h2>

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

                    {/* grid infos */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">

                        <p className="truncate">
                            <span className="text-red-500 font-semibold">
                                Círculo:
                            </span>{" "}
                            {ritual.circle}
                        </p>

                        <p className="truncate">
                            <span className="text-red-500 font-semibold">
                                Exec:
                            </span>{" "}
                            {ritual.exec}
                        </p>

                        <p className="truncate">
                            <span className="text-red-500 font-semibold">
                                Alc:
                            </span>{" "}
                            {ritual.range}
                        </p>

                        <p className="truncate">
                            <span className="text-red-500 font-semibold">
                                Dura:
                            </span>{" "}
                            {ritual.duration}
                        </p>
                    </div>

                    {/* descrição */}
                    <p className="text-xs text-zinc-300 line-clamp-2 mt-2">
                        {ritual.description}
                    </p>

                    {/* footer */}
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-zinc-500 truncate">
                            {ritual.creator.name}
                        </span>

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