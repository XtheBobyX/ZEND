import "../utils/asocciationsModel";

import { Request, Response } from "express";
import Mensajes from "../models/mensajes";
import Usuario from "../models/usuario";
import { Op } from "sequelize";
import sequelize from "../../connection";

const getListaUsuario = async (req: Request, res: Response) => {
  const idUsuario = Number(req.query.usuario);

  try {
    const conversaciones = await Mensajes.findAll({
      where: {
        [Op.or]: [{ id_remitente: idUsuario }, { id_receptor: idUsuario }],
      },
      attributes: [
        [
          sequelize.literal(
            `CASE WHEN id_remitente = ${idUsuario} THEN id_receptor ELSE id_remitente END`
          ),
          "id_usuario",
        ],
      ],
      group: ["id_usuario"],
      raw: true,
    });

    const ids = conversaciones.map((c: any) => c.id_usuario);

    const usuarios = await Usuario.findAll({
      where: { id_usuario: ids },
      attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
    });

    return res.json({ success: true, data: usuarios });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error al obtener lista de usuarios: ${error} `,
    });
  }
};

const obtenerConversaciones = async (req: Request, res: Response) => {
  const { usuario1, usuario2 } = req.body;

  if (!usuario1 || !usuario2) {
    return res
      .status(404)
      .json({ success: false, msg: "Los id son necesarios" });
  }

  try {
    const conversaciones = await Mensajes.findAll({
      include: [
        {
          model: Usuario,
          as: "remitente",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
        {
          model: Usuario,
          as: "receptor",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
      ],
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ id_remitente: usuario1 }, { id_receptor: usuario2 }],
          },
          {
            [Op.and]: [{ id_remitente: usuario2 }, { id_receptor: usuario1 }],
          },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    return res.json({ success: true, data: conversaciones });
  } catch (error) {
    res.json({
      success: false,
      error: `Error al obtener conversaciones: ${error}`,
    });
  }
};

const enviarMensaje = async (req: Request, res: Response) => {
  const { id_receptor, id_remitente, contenido } = req.body;

  if (!id_receptor || !id_remitente || !contenido) {
    return res.status(404).json({ success: false, msg: "Datos incorrectos" });
  }

  try {
    const newMensaje: any = await Mensajes.create({
      id_receptor,
      id_remitente,
      contenido,
    });

    const fullMensaje = await Mensajes.findByPk(newMensaje.id_mensaje, {
      include: [
        {
          model: Usuario,
          as: "remitente",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
        {
          model: Usuario,
          as: "receptor",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
      ],
    });

    return res.json({ success: true, data: fullMensaje });
  } catch (error) {
    res.json({
      success: false,
      error: `Error al enviar el mensaje: ${error}`,
    });
  }
};
export default {
  obtenerConversaciones,
  listadoConversaciones: getListaUsuario,
  enviarMensaje,
};
