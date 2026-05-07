import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    
    if(!req.user.admin){
        return res.status(401).json({
         error: "Sem permissão"
      });
    }

    next()
}