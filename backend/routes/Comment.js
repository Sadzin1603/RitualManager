import express from 'express';
import controller from '../controllers/CommentController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router
    .route("/:id")
    .post(verifyToken,controller.post)//cria o comentário
    .get(controller.get)//pega os comentarios de um ritual



export default router;