import { useNavigate } from "react-router-dom";
import Card from "../components/Card"
import { useEffect, useState } from "react";

function Admin() {
    const [rituais, setRituais] = useState([]);
    //aq na primeira vez ele carrega os rituais pendentes
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const token = localStorage.getItem("token");
        const res = await fetch(
            "http://localhost:3000/admin/rituals/pending",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await res.json();

        setRituais(data);
    }

    async function changeAproved(id, status) {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:3000/admin/ritual/${id}/${status}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

        } catch (err) {
            console.log(err.message)
        }

        fetchData()

    }

    const navigate = useNavigate();

    return (
        <div className="title w-auto min-h-screen flex justify-center p-6 items-start">
            <div className="flex w-auto flex-wrap justify-center items-start gap-10">
                {rituais.map((ritual) => (
                    <div className="flex items-center p-1" key={ritual.id}>
                        <Card key={ritual.id} ritual={ritual}></Card>
                        <div className="flex flex-col justify-center pl-4 space-y-20">
                            <button className="bg-green-300" onClick={() => { changeAproved(ritual.id, "aprovado") }}>Aprovar</button>
                            <button className="bg-red-300" onClick={() => { changeAproved(ritual.id, "reprovado") }}>Reprovar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default Admin;