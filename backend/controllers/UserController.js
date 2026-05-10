import {getById,changeOne,deleteOne,getRituais} from '../services/UserServices.js'

export default {
    get: async (req,res) =>{
        try {
            const user = await getById(req.params.id);
            return res.json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    put: async (req,res) =>{
        try{
            const user = await changeOne(req.params.id,req.body)
            return res.json({"message":"atualizado"})
        }catch (err){
            return res.status(400).json({error:err.message})
        }
    },
    delete: async (req,res) => {
        try{
            await deleteOne(req.params.id)
            return res.json({"message":"deleted"})
        }catch(err ){
            return res.status(400).json({error:err.message})
        }
    },
    getRituais: async (req,res) => {
        try{
            const rituais = await getRituais(req.params.id)
            return res.json(rituais)
        }catch (err ){
            return res.status(400).json({error:err.message})
        }
    }
}