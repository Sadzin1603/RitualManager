import express from 'express';
import controller from '../controllers/AuthController.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router
    .route("/register")
    .post(controller.register)

router
    .route("/login")
    .post(controller.login)
    
router
    .route("/me")
    .get(verifyToken,controller.get)


export default router;