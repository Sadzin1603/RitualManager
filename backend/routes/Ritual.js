import express from 'express';
import multer from "multer";
import controller from '../controllers/RitualController.js'
import {verifyToken} from '../middlewares/AuthMiddleware.js'
import {verifyAdmin} from '../middlewares/AdminMiddleware.js'
import {verifyOwner} from '../middlewares/OwnerMiddleware.js'

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router
    .route("/")
    .get(controller.get)//retornar só o status=aprovado
    .post(upload.single("file"),controller.post)

router
    .route("/copy")
    .post(upload.single("file"),controller.copy)

router
    .route("/delete/:id")
    .put(verifyToken,verifyOwner,upload.single("file"),controller.changeCreator)

router
    .route("/:id")
    .get(verifyToken,controller.getId)//pego a porra do ritual com base no id (aprovado)
    .put(upload.single("file"),controller.put)//editar a porra do ritual
    .delete(verifyToken,(verifyOwner||verifyAdmin),controller.delete)//deleta a porra do ritual (admin)

export default router;