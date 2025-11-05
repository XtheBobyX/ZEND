import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario";
import { subirImagen } from "../../cloudinary/cloudinary";
import { Op } from "sequelize";
import { generarToken, validarToken } from "../middlewares/auth";

//
const registrarUsuario = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Comprobar si existe
    const existeUsuario = await Usuario.findOne({ where: { username } });

    if (existeUsuario) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hash_password = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      username: username,
      password: hash_password,
    });

    //TODO: FALTA EL JWT
    const usuarioPlano = usuario.get({ plain: true });

    const token = generarToken(usuarioPlano);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .header("authotization", token)
      .json({
        message: "Usuario Logueado",
        token: token,
      });
  } catch (error) {
    console.error("Error al insertar usuario:", error);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validaciones
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username y password son requeridos" });
  }

  try {
    // Busqueda del Usuario
    const usuario = await Usuario.findOne({
      where: { username },
      attributes: ["id_usuario", "username", "password"],
    });

    if (!usuario) {
      return res.status(400).json({ error: "El usuario no existe" });
    }

    // Comparar Contraseñas
    const hash = usuario.getDataValue("password");
    const coincide = await bcrypt.compare(password, hash);

    if (!coincide) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Login Correcto

    // Convertir a objeto plano
    const datosUsuario = usuario.get({ plain: true });

    // Enviar usuario sin contraseña
    const { hash_password, ...usuarioSinPassword } = datosUsuario;

    // Generar token JWT
    const token = generarToken(datosUsuario);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .header("authotization", token)
      .json({
        message: "Usuario Logueado",
        token: token,
      });
  } catch (error) {
    console.error("Error al insertar usuario:", error);
  }
};

//
const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios: ", error);
    return res
      .status(500)
      .json({ error: "Error al obtener usuarios", details: error });
  }
};

const personalizarPerfil = async (req: Request, res: Response) => {
  const { username, nombre_completo, biografia, avatar, portada } = req.body;

  // URLs de las imagenes subidas
  let avatarUpload: string | null = null;
  let portadaUpload: string | null = null;

  // Subir la imagen si se pasa imagen
  if (!avatar.startsWith("data:image/svg+xml")) {
    avatarUpload = await subirImagen(avatar, "avatar", username);
  }

  if (portada !== "/src/assets/img/background.jpg") {
    portadaUpload = await subirImagen(portada, "portada", username);
  }

  // Actualizar el usuario en la base de datos
  try {
    const usuario = await Usuario.update(
      {
        nombre_completo,
        biografia,
        avatar: avatarUpload,
        portada: portadaUpload,
      },
      { where: { username } }
    );

    return res.json({ usuario, message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.log("Error al actualizar el perfil:", error);
    return res.status(500).json({ error: "Error al actualizar el perfil" });
  }
};

const getUsuarioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  res.json(usuario);
};

const getUsuarioByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const usuario = await Usuario.findOne({ where: { username } });
  res.json(usuario);
};

const buscarUsuarios = async (req: Request, res: Response) => {
  const query = req.query.search as string;
  if (!query || query.trim() === "" || query === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Falta el parámetro de búsqueda (search)",
    });
  }
  try {
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: {
          username: { [Op.like]: `%${query}%` },
          nombre_completo: { [Op.like]: `%${query}%` },
        },
      },
    });

    return res.json({ success: true, data: usuarios });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error al buscar usuarios " + error,
    });
  }
};

export default {
  getUsuarios,
  registrarUsuario,
  personalizarPerfil,
  login,
  getUsuarioById,
  getUsuarioByUsername,
  buscarUsuarios,
};
