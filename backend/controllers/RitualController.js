import {create,pegar} from '../services/RitualServices.js'
export default {
    post: async (req,res) =>{
            try {
                const rituais = await create(req.file,req.body);
                return res.status(204).json(token);
            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        },
        get: async(req,res) =>{
            try{
                const rituais = await pegar();
                return res.json(rituais);
            }catch (err){
                return res.status(400).json({error: err.message})
            }
        }
}