import {deleteUser,updateRitual} from '../services/AdminServices.js'

export default {
    deleteUser: async(req,res) =>{
        try{
            const user = await deleteUser(req.user);
            return res.json(user);
        }catch (err){
            return res.status(400).json({error: err.message})
        }
    },
    updateRitual: async(req,res) =>{
        try{
            const ritual = await updateRitual(req.params.id,req.body)
            return res.send(200)
        } catch (err){
            return res.status(400).json({error:err.message})
        }
    },
    /*deleteRitual: async(req,res) =>{
        try{
            const ritual = await atualizar(req.params.id,req.body)
            return res.status(204)
        } catch (err){
            return res.status(400).json({error:err.message})
        }
    },*/
}