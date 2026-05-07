import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { useEffect, useState } from "react";

function Admin(){
    const [rituais, setRituais] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:3000/ritual?staus=pendente");
            const data = await res.json();
            setRituais(data);
        }

        fetchData();
    }, []);

    const navigate = useNavigate();
    
    return(
        <div className="title w-auto min-h-screen flex justify-center p-6">
            <div className="space-y-4">
                {rituais.map((ritual) => ( 
                        <div className="flex p-1">
                        <Card key={ritual.id} ritual={ritual}></Card>
                        <div className="flex flex-col justify-center pl-4 space-y-20">
                            <button className="bg-green-300">Aprovar</button>
                            <button className="bg-red-300">Reprovar</button>
                        </div>
                        </div>
                    ))}
            </div>
        </div>
        
    )
}

export default Admin;