import 'dotenv/config'; 
import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
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

//======================================================
//rota para cadastrar os clientes
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
//======================================================

//rota de login de usuarios
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
    { expiresIn: "1d" }
    );

    res.status(200).json({ token });
})

//======================================================
app.get("/protegida", authToken,(req,res)=>{
    res.json({message:"Entrando em area protegida"})
})

//======================================================
app.get("/principal", authToken, (req, res) => {
  res.json({ msg: "Bem-vindo" });
});
//======================================================

const upload = multer({ storage: multer.memoryStorage() });
//rota para adicionar o ritual no banco de dados
app.post("/ritual",upload.single("file"),async (req,res)=>{
    const file = req.file;
    const {name,element,circle,exec,range,area,target,effect,resistence,dices,description,discent_description,truly_description,discent_dices,truly_dices,creator} = req.body
    
    if (!file) {
        return res.status(400).send("Nenhum arquivo enviado");
    }

    const { data, error } = await supabase.storage
        .from("fotos_rituais")
        .upload(`public/${file.originalname}`, file.buffer);

    if (error) {
        return res.status(500).json(error);
    }
    const { data: publicUrlData } = supabase
        .storage
        .from("fotos_rituais")
        .getPublicUrl(`public/${file.originalname}`);

    const imageUrl = publicUrlData.publicUrl;
    const {data:data2,error:error2} = await supabase
        .from("Rituais")
        .insert([{name,img:imageUrl,element,circle,exec,range,area,target,effect,resistence,dices,description,discent_description,truly_description,discent_dices,truly_dices,creator}])
    
    if(error2){
        return res.status(500).json(error);
    }
    res.status(201).json(data2);

})

app.get("/ritual", async (req,res)=>{
    const {data, error} = await supabase
                            .from("Rituais")
                            .select("*")

    if(error){
        return res.status(400).json({message:erro})
    }
    
    return res.json(data)
})




app.listen(port,()=>{
    console.log("Servidor roadando na porta "+port)
})