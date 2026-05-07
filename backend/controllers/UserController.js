import {create} from '../services/UserServices.js'

export default {
    post: async (req,res) =>{
        try {
            const user = await create(req.body);
            return res.status(201).json(user);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }
}