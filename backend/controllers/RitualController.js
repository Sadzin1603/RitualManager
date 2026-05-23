import {create,pegar,pegarId,changeById,deleteById} from '../services/RitualServices.js'
export default {
    post: async (req,res) =>{
        try {
            const rituais = await create(req.file,req.body,{"status":"pendente"});
            return res.json({"message":"ritual criado"});
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    get: async(req,res) =>{
        try{
            const rituais = await pegar({...req.query,"status":"aprovado"});
            return res.json(rituais);
        }catch (err){
            return res.status(400).json({error: err.message})
        }
    },
    copy: async(req,res)=>{
        try {
            const rituais = await create(req.body.file,req.body,{"status":req.body.status});
            return res.json({"message":"ritual copiado"});
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    changeCreator: async(req,res)=>{
        try {
            const rituais = await changeById(req.body.file,req.params.id,req.body);
            return res.json({"message":"ritual deletado"});
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    getId: async(req,res) =>{
        try{
            const rituais = await pegarId(req.params.id,req.user);
            return res.json(rituais);
        }catch (err){
            return res.status(400).json({error: err.message})
        }
    },
    put: async (req,res) => {
        try{
            const ritual = await changeById(req.file,req.params.id,req.body)
            return res.json({"message":"atualizado"})
        }catch (err){
            return res.status(400).json({error:err.message})
        }
    },
    delete : async (req,res) =>{
        try{
            const ritual = await deleteById(req.params.id)
            return res.json({"message":"deleted"})
        }catch (err){
            return res.status(400).json({message:err.message})
        }
    }
}