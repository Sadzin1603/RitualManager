import express from 'express';
import controller from '../controllers/AdminController.js'
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import { verifyAdmin } from '../middlewares/AdminMiddleware.js';

const router = express.Router();

router
    .route("/rituals/pending")
    .get(verifyToken,verifyAdmin,controller.getPendingRituals)    

router
    .route("/ritual/:id/:status")
    .patch(verifyToken,verifyAdmin,controller.updateRitual)
    
router
    .route("/users")
    .get(controller.getAll)

export default router;

