import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {useNavigate} from "react-router-dom"
import Input from "../components/Input"

function Login(){
    const navigate = useNavigate();

    const [email,setEmail] = useState<String>("")
    const [password,setPassword] = useState<String>("")

    const [show, setShow] = useState<boolean>(false);//ver a senha
    function mostrar() {
        setShow(!show);
    }
    
    
    async function logar(){
        try{
            const response = await fetch("http://localhost:3000/login",{
                method:"POST",
                headers:{ 'Content-Type': 'application/json' },
                body: JSON.stringify({ email,password })
            }) 
            const data = await response.json();
            localStorage.setItem("token",data.token)
        }catch(e){
            console.log(e)
        }
    }
    async function teste(){
        
        const token = localStorage.getItem("token");
        if(token){
            await fetch("http://localhost:3000/protegida",{
                headers:{Authorization: `Bearer ${token}`}
            })
           navigate("/") //MUDAR A ROTA PARA ONDE EU QUERO IR
        }
        
    
    }

    return( 
    <div className="title w-screen min-h-screen flex justify-center p-6">
        <div className="w-[500px] space-y-4"> 
            <div className="div space-y-6 p-6 rounded-md shadow flex flex-col">
                <h1 className="text-white text-center font-black text-3xl">
                    Login
                </h1>
                <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative">
                    <input
                    type={show ? "text" : "password"}
                    placeholder="senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input px-4 py-2 rounded-2xl placeholder-gray-400 text-white w-full"
                    />
                    <span
                    className="absolute text-white right-3 top-2.5 cursor-pointer"
                    onClick={mostrar}
                    >
                    {show ? <EyeIcon /> : <EyeOffIcon />}
                </span>
                </div>
                
                <button
                    className="input px-4 py-2 rounded-2xl placeholder-gray-400 text-white cursor-pointer"
                    type="submit"
                    onClick={
                        logar
                    }
                >
                    Logar
                </button>
                <button
                    className="input px-4 py-2 rounded-2xl placeholder-gray-400 text-white cursor-pointer"
                    type="submit"
                    onClick={
                        teste
                    }
                >
                    acessar o desconhecido
                </button>
            </div>
        </div>
    </div>
    )
}
export default Login;