import express from "express";
const router = express.Router();
import followController from "../controllers/followController";

router.get("/users/:id/follower", followController.getFollowers);
router.get("/users/:id/followed", followController.getFollowing);
router.get("/top", followController.topPopularUsers);
router.get("/exist", followController.hasFollow);
router.post("/", followController.toggleFollow);

export default router;
