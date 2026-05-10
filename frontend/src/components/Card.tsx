import { useNavigate } from "react-router-dom";
import "./Card.css";

function Card({ ritual }) {
    const navigate = useNavigate();
    return (
        <div className="Card">

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
                <h2 className="text-xl font-bold">{ritual.name}</h2>

                <div className="info_ritual">
                    <p>Circulo: {ritual.circle}°</p>
                    <p>Execução: {ritual.exec}</p>
                    <p>Alcance: {ritual.range}</p>
                    <p>Duração: {ritual.duration}</p>
                </div>

                <p className="text-sm text-zinc-300 line-clamp-2">
                    {ritual.description}
                </p>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-zinc-500">
                        Criado por: {ritual.creator.name}
                    </span>

                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm"
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