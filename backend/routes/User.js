import express from 'express';
import controller from '../controllers/UserController.js'

const router = express.Router();

router
    .route("/")
    .post(controller.post)

export default router;