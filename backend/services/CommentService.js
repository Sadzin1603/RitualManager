import {create,getCommentsByRitualId} from '../models/CommentModel.js'

export const createComment = async (ritualId, userId,{comentario}) => {
    console.log(comentario)
    if(!ritualId || !userId || !comentario){
        throw new Error("Missing fields")
    }
    
    return await create(ritualId,userId,comentario)
}

export const getComments = async (ritualId) => {
    if(!ritualId){
        throw new Error("Missing fields")
    }

    return await getCommentsByRitualId(ritualId);
}