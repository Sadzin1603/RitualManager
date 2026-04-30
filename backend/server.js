import 'dotenv/config'; // Mova para a primeira linha
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors"

const port = 3000
export const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)
const app = express();
app.use(express.json())
app.use(cors());

app.post('/cadastro',async(req,res)=>{

    const {name,email,password} = req.body

    if(!email || !password){
        return res.status(400).json({error:'Email e senha obrigatorios'})
    }

    const {data,error} = await supabase
                    .from('Clients')
                    .insert([{name,email,password}])
    
    if(error){
        return res.status(500).json({error:error.message})
    }

    return res.status(201).json({message:"Cliente salvo com sucesso",data})

})



app.listen(port,()=>{
    console.log("Servidor roadando na porta "+port)
})