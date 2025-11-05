import express from "express";
const router = express.Router();
import encuestaController from "../controllers/encuestaController";

router.post("/votar", encuestaController.votar);
router.get("/haVotado", encuestaController.haVotado);
export default router;
