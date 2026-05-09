import {getUsers,updateRitual,getRituals} from '../services/AdminServices.js'

export default {
    getPendingRituals: async(req,res) =>{
        try{
            const users = await getRituals();
            return res.json(users);
        }catch (err){
            return res.status(400).json({error: err.message})
        }
    },
    updateRitual: async(req,res) =>{
        try{
            const ritual = await updateRitual(req.params.id,req.params.status)
            return res.send(200)
        } catch (err){
            return res.status(400).json({error:err.message})
        }
    },
    getAll: async(req,res) =>{
        try{
            const users = await getUsers()
            return res.json(users);
        } catch (err){
            return res.status(400).json({error:err.message})
        }
    },
}