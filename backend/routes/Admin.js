import express from 'express';
import controller from '../controllers/AdminController.js'
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import { verifyAdmin } from '../middlewares/AdminMiddleware.js';

const router = express.Router();

router
    .route("/users/:id")
    .delete(verifyToken,verifyAdmin,controller.deleteUser)    


export default router;