import {verify,me} from '../services/AuthServices.js'

export default {
    post: async (req,res) =>{
        try {
            const token = await verify(req.body);
            return res.status(201).json(token);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    get: async(req,res) =>{
        try{
            const user = await me(req.user);
            return res.json(user);
        }catch (err){
            return res.status(400).json({error: err.message})
        }
    }
}