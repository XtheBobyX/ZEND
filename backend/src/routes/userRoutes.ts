import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

// AUTENTTICACIÓN
router.post("/register", userController.registerUser);
router.post("/login", userController.login);
// router.post("/logout", usuarioController.logout);

// USUARIOS
router.get("/", userController.getUsers);
router.get("/id/:id", userController.getUserById);
router.get("/username/:username", userController.getUserByUsername);

// Buscador
router.get("/search", userController.searchUsers);

// PERFIL
router.put("/:id/profile", userController.customizeProfile);

export default router;
