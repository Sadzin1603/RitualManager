import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { useEffect, useState } from "react";

function Principal(){
    const [rituais, setRituais] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:3000/ritual");
            const data = await res.json();
            console.log(data);
            setRituais(data);
        }

        fetchData();
    }, []);

    const navigate = useNavigate();
    
    return(
        <div className="title w-screen min-h-screen flex justify-center p-6">
            <div className="space-y-4">
                {rituais.map((ritual) => ( 
                        <Card key={ritual.id} ritual={ritual}></Card>
                    ))}
            </div>
            <div className="ml-10 w-[300px] bg-zinc-900 text-white p-5 rounded-xl shadow-lg border border-zinc-800 flex flex-col space-y-5">
    
            {/* Botão principal */}
            <button 
                className="w-full bg-purple-700 hover:bg-purple-800 transition-all duration-200 p-3 rounded-lg font-semibold tracking-wide shadow-md"
                onClick={() => navigate("/rituais")}
            >
                + Criar Ritual
            </button>

            {/* Filtros */}
            <div className="space-y-4">
                
                {/* Header */}
                <nav className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <h1 className="text-lg font-bold">Filtros</h1>
                    <button className="bg-purple-700 hover:bg-purple-800 transition-all text-xs text-zinc-50 hover:text-white transition">
                        Limpar
                    </button>
                </nav>

                {/* Campo */}
                <label htmlFor="elemento" className="flex flex-col space-y-1">
                    <h2 className="text-sm font-medium text-zinc-400">Elemento</h2>

                    <select 
                        id="elemento"
                        className="bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                    >
                        <option value="">Todos</option>
                        <option value="morte">Morte</option>
                        <option value="sangue">Sangue</option>
                        <option value="energia">Energia</option>
                    </select>
                </label>

            </div>
        </div>
        </div>
    )
}

export default Principal;