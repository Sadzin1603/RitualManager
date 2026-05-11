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

function Card({ ritual }) {
    const navigate = useNavigate();
    const classeElemento = elementoClasse[ritual.element?.toLowerCase()] ?? "";
    return (
        <div className={`Card ${classeElemento}`}>

            {/* Imagem */}
            <div className="h-40 bg-zinc-800">
                {ritual.img ? (
                    <img 
                        src={ritual.img} 
                        alt={ritual.name} 
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
                <h2 className="Card-nome text-xl font-bold">{ritual.name}</h2>

                <div className="info_ritual">
                    <p><span className="info-titulo">Círculo:</span> {ritual.circle}°</p>
                    <p><span className="info-titulo">Execução:</span> {ritual.exec}</p>
                    <p><span className="info-titulo">Alcance:</span> {ritual.range}</p>
                    <p><span className="info-titulo">Duração:</span> {ritual.duration}</p>
                </div>

                <p className="text-sm text-zinc-300 line-clamp-2">
                    {ritual.description}
                </p>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-zinc-500">
                        Criado por: {ritual.creator.name}
                    </span>

                    <button className="btn-ver-mais bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm"
                        onClick={()=>{navigate(`/ritual/${ritual.id}`)}}
                    >
                        Ver mais
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;