import jwt from 'jsonwebtoken';

export const verifyOwner = (req, res, next) => {
    const user_id = req.user.id
    const creator_id = req.headers.ritual
    if(user_id != creator_id){
        return res.status(401).json({
         error: "Sem permissão"
      });
    }
    next()
}