import express from "express";
const router = express.Router();
import followController from "../controllers/followController";

router.get("/usuarios/:id/seguidores", followController.getSeguidores);
router.get("/usuarios/:id/seguidos", followController.getSeguidos);
router.get("/top", followController.topPopulares);
router.get("/existe", followController.tieneFollow);
router.post("/", followController.toggleFollow);

export default router;
