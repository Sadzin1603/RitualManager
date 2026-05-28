import { createComment,getComments } from '../services/CommentService.js';

export default {
    post: async (req,res) =>{
        try{
            const comment = await createComment(req.params.id,req.user.id,req.body)
            return res.json(comment)
        }catch (err){
            return res.status(400).json({error:err.message})
        }
    },
    get: async (req,res) =>{
        try{
            const comments = await getComments(req.params.id)
            return res.json(comments)
        }catch (err){
            return res.status(400).json({error:err.message})
        }
    }
}