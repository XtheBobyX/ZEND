import express from "express";
const router = express.Router();
import pollController from "../controllers/pollController";

router.post("/vote", pollController.vote);
router.get("/hasVoted", pollController.hasVoted);
export default router;
