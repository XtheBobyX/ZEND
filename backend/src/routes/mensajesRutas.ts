import { Router } from "express";
import mensajesController from "../controllers/mensajesController";

const router = Router();
router.post("/conversaciones", mensajesController.obtenerConversaciones);
router.get("/listado", mensajesController.listadoConversaciones);
router.post("/enviar", mensajesController.enviarMensaje);
export default router;
