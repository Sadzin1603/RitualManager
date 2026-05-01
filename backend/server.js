import 'dotenv/config'; 
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authToken from"./middleware.js"

const port = 3000

export const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)
const app = express();
app.use(express.json())
app.use(cors());

//GET -pegar
//POST -criar
//DELETE -deleta
//PUT -updeita


app.post('/cadastro',async (req,res)=>{

    const {name,email,password} = req.body

    if(!email || !password){
        return res.status(400).json({error:'Email e senha obrigatorios'})
    }

    const passHash = await bcrypt.hash(password, 12);

    const {data,error} = await supabase
                    .from('Clients')
                    .insert([{name,email,password:passHash}])
    
    if(error){
        return res.status(500).json({error:error.message})
    }

    return res.status(201).json({message:"Cliente salvo com sucesso",data})

})

app.post("/login",async (req,res)=>{
    const {email,password} = req.body
    const {data,error} = await supabase
                        .from("Clients")
                        .select("*")
                        .eq("email",email)
                        .single()

                        
    if(error){
        return res.status(500).json({error:error.message, user:"User Not Found"})
    }
    
    const senhaValida = await bcrypt.compare(password, data.password);
    

    if(!senhaValida){
        return res.status(400).json({error:"Senha invalida"})
    }

    const token = jwt.sign(
    { id: data.id,
        name:data.name
     },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
    );

    res.status(200).json({ token });
})

app.get("/protegida", authToken,(req,res)=>{
    res.json({message:"Entrando em area protegida"})
})


// app.get('/cadastros',async(req,res)=>{
//     const {data,error} = await supabase
//                     .from('Clients')
//                     .select('*')
//     if(error){
//         return res.status(500).json({error:error.message})
//     }

//     return res.status(201).json({message:"Clientes resgatados com sucesso",data})
// })




app.listen(port,()=>{
    console.log("Servidor roadando na porta "+port)
})