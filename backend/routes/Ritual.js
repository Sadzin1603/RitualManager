import express from 'express';
import multer from "multer";
import controller from '../controllers/RitualController.js'

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router
    .route("/")
    .get(controller.get)
    .post(upload.single("file"),controller.post)

export default router;