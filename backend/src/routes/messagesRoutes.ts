import { Router } from "express";
import mensajesController from "../controllers/messageController";

const router = Router();
router.post("/conversations", mensajesController.getConversations);
router.get("/list", mensajesController.getUserList);
router.post("/send", mensajesController.sendMessage);
export default router;
