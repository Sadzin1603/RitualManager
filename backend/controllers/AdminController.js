import {deleteUser} from '../services/AdminServices.js'

export default {
    deleteUser: async(req,res) =>{
        try{
            const user = await deleteUser(req.user);
            return res.json(user);
        }catch (err){
            return res.status(400).json({error: err.message})
        }
    }
}