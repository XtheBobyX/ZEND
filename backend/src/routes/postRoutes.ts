import { Router } from "express";
import postController from "../controllers/postController";

const router = Router();

// POSTS
router.get("/", postController.getPosts);
router.post("/", postController.createPost);
router.get("/id/:id", postController.getPostById);
router.delete("/id/:id", postController.deletePostById);

// Post de un usuario
router.get("/user/:id", postController.getPostsByUser);

// Buscador
router.get("/buscar", postController.searchPosts);

// Likes
router.get("/:id/like", postController.hasLike);
router.post("/:id/like", postController.toggleLike);
// router.get("/:id/likes", postController.getLikesByUsuario);

// Marcadores
router.get("/:id/save", postController.hasSavedPost);
router.post("/:id/save", postController.toggleSavePost);
router.get("/saves/:id", postController.getSavedPosts);

// Repost
router.post("/:id/repost", postController.repost);

// comments
router.get("/:id/comments", postController.getComments);
router.post("/:id/comments", postController.addComment);
export default router;
