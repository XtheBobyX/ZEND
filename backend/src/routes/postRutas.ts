import { Router } from "express";
import postController from "../controllers/postController";

const router = Router();

// POSTS
router.get("/", postController.getPosts);
router.post("/", postController.enviarPost);
router.get("/id/:id", postController.getPostById);
router.delete("/id/:id", postController.borrarPostById);

// Post de un usuario
router.get("/usuario/:id", postController.getPostByUsuario);

// Buscador
router.get("/buscar", postController.buscarPosts);

// Likes
router.get("/:id/like", postController.haveLike);
router.post("/:id/like", postController.like);
// router.get("/:id/likes", postController.getLikesByUsuario);

// Marcadores
router.get("/:id/save", postController.haveSave);
router.post("/:id/save", postController.savePost);
router.get("/saves/:id", postController.getPostGuardados);

// Repost
router.post("/:id/repost", postController.repostear);

// Comentarios
router.get("/:id/comentarios", postController.getComentarios);
router.post("/:id/comentarios", postController.comentar);
export default router;
