import { Request, Response } from "express";

// Modelos
import "../utils/asocciationsModel";
import Seguidores from "../models/seguidores";
import Usuario from "../models/usuario";
import { Sequelize } from "sequelize";

const toggleFollow = async (req: Request, res: Response) => {
  try {
    // Validaciones
    const id_seguidor = req.query.seguidor;
    const id_seguido = req.query.seguido;

    if (!id_seguidor || !id_seguido) {
      return res
        .status(400)
        .json({ error: "Faltan IDs de seguidor / seguido" });
    }

    if (id_seguidor === id_seguido) {
      return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }

    //
    let leSigo = await Seguidores.findOne({
      where: {
        id_seguidor: id_seguidor,
        id_seguido: id_seguido,
      },
    });

    if (leSigo) {
      await leSigo.destroy();
      return res.json({
        success: true,
        action: "dejar seguir",
        data: leSigo,
        leSigo: false,
      });
    }
    // Seguirle
    leSigo = await Seguidores.create({ id_seguidor, id_seguido });
    return res.json({
      success: true,
      action: "seguir",
      data: leSigo,
      leSigo: true,
    });
  } catch (error) {
    console.error("toggleFollow error:", error);
    return res.status(500).json({ success: false, error: "Error interno" });
  }
};

const tieneFollow = async (req: Request, res: Response) => {
  try {
    const seguidor = Number(req.query.seguidor);
    const seguido = Number(req.query.seguido);

    if (isNaN(seguidor) || isNaN(seguido)) {
      return res.status(400).json({ error: "IDs no validos" });
    }

    let leSigo = await Seguidores.findOne({
      where: {
        id_seguidor: seguidor,
        id_seguido: seguido,
      },
    });

    return res.json({ follow: !!leSigo });
  } catch (error) {
    return res.status(500).json({ error: "Error en comprobar el follow" });
  }
};

const topPopulares = async (req: Request, res: Response) => {
  try {
    const seguidores = await Seguidores.findAll({
      attributes: [
        "id_seguido",
        [Sequelize.fn("COUNT", Sequelize.col("id_seguidor")), "cantidad"],
      ],
      group: ["id_seguido"],
      order: [[Sequelize.literal("cantidad"), "DESC"]],
      limit: 5,
      include: [
        {
          model: Usuario,
          as: "seguido",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
      ],
    });

    const topUsuarios = seguidores.map((s: any) => s.seguido);
    return res.json({ success: true, data: topUsuarios });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

const getSeguidores = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    const seguidores = await Seguidores.findAndCountAll({
      where: { id_seguido: id },
      include: [
        {
          model: Usuario,
          as: "seguidor",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
      ],
    });
    return res.json({ success: true, data: seguidores });
  } catch (error) {
    res.json(`Error: ` + error);
  }
};

const getSeguidos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const seguidos = await Seguidores.findAndCountAll({
      where: { id_seguidor: id },
      include: [
        {
          model: Usuario,
          as: "seguido",
          attributes: ["id_usuario", "username", "nombre_completo", "avatar"],
        },
      ],
    });
    return res.json({ success: true, data: seguidos });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener seguidos" + error });
  }
};

export default {
  toggleFollow,
  tieneFollow,
  topPopulares,
  getSeguidores,
  getSeguidos,
};
