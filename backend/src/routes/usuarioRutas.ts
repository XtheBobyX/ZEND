import express from "express";
const router = express.Router();
import usuarioController from "../controllers/usuarioController";

// AUTENTTICACIÓN
router.post("/register", usuarioController.registrarUsuario);
router.post("/login", usuarioController.login);
// router.post("/logout", usuarioController.logout);

// USUARIOS
router.get("/", usuarioController.getUsuarios);
router.get("/id/:id", usuarioController.getUsuarioById);
router.get("/username/:username", usuarioController.getUsuarioByUsername);

// Buscador
router.get("/buscar", usuarioController.buscarUsuarios);

// PERFIL
router.put("/:id/perfil", usuarioController.personalizarPerfil);

export default router;
