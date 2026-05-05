function Card({ ritual }) {
    return (
        <div className="w-[600px] bg-zinc-900 text-white rounded-xl shadow-lg overflow-hidden border border-zinc-800 hover:scale-[1.02] transition">

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
            <div className="p-5 space-y-3">
                <h2 className="text-xl font-bold">{ritual.name}</h2>

                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                    <p>Elemento: <span className={ritual.element=="sangue"?"text-red-900":"text-white"}>{ritual.element}</span></p>
                    <p>Alcance: {ritual.range}</p>
                    {ritual.area ? '<p>Area {ritual.area}</p><p>Area {ritual.area}</p>' : ""}

                    
                </div>

                <p className="text-sm text-zinc-300 line-clamp-2">
                    {ritual.description}
                </p>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-zinc-500">
                        Execução: {ritual.exec}
                    </span>

                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-md text-sm">
                        Ver mais
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Card;