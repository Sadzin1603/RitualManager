import express from 'express';
import controller from '../controllers/UserController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { verifyAdmin } from '../middlewares/AdminMiddleware.js';

const router = express.Router();

router
    .route("/:id")
    .get(controller.get)//pega a pessoa pelo id (qualquer um pode pegar os dados?)
    .put(verifyToken,controller.put)//atualiza a pessoa pelo id
    .delete(verifyToken,controller.delete)//deleta a pessoa pelo id

router
    .route("/:id/rituais")
    .get(controller.getRituais)//pega os rituais feitos pela pessoa

export default router;