import { useNavigate } from "react-router-dom";
import Card from "../components/Card"

function Principal(){
    const navigate = useNavigate();
    return(
        <div className="title w-screen min-h-screen flex justify-center p-6">
            <div className="space-y-4">
                <Card></Card>
                <Card></Card>
                <Card></Card>
            </div>
            <div className="div ml-10 p-4 space-y-3 rounded-md shadow flex flex-col w-[300px]">
                <button className="bg-purple-800 p-4" onClick={()=>navigate("/rituais")}>Criar Ritual</button>
                <div>
                    <nav><h1>Filtros</h1><button>Limpar filtros</button></nav>
                    <label htmlFor="elemento">
                        <h2>Elemento</h2>
                        <select name="" id="elemento"><option value="morte">Morte</option><option value="sangue">Sangue</option><option value="energia">Energia</option></select>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Principal;