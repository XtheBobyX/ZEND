import { Response, Request } from "express";

import Encuesta from "../models/encuesta";
import Votos_encuestas from "../models/votos_encuestas";
import "../utils/asocciationsModel";

const votar = async (req: Request, res: Response) => {
  try {
    const { id_encuesta, id_opcion, id_usuario } = req.body;

    // Validar
    if (!id_encuesta || !id_opcion || !id_usuario) {
      return res.status(400).json({ success: false, msg: "Faltan datos" });
    }

    const encuesta: any = await Encuesta.findOne({
      attributes: ["multiple_opciones"],
      where: { id_encuesta },
    });

    if (!encuesta) {
      return res.status(404).json({
        success: false,
        msg: "No hay encuesta con el id " + id_encuesta,
      });
    }

    if (!encuesta.multiple_opciones) {
      await Votos_encuestas.destroy({
        where: { id_encuesta, id_usuario },
      });
      await Votos_encuestas.create({ id_encuesta, id_opcion, id_usuario });
    } else {
      const yaVoto = await Votos_encuestas.findOne({
        where: { id_encuesta, id_opcion, id_usuario },
      });

      if (yaVoto) {
        yaVoto.destroy();
      } else {
        await Votos_encuestas.create({ id_encuesta, id_opcion, id_usuario });
      }
    }

    return res.json({ success: true, action: "Votado" });
  } catch (error) {
    return res.status(500).json({ msg: "Error al votar" + votar });
  }
};

const haVotado = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.query.usuario;

    //
    const votos = await Votos_encuestas.findAll({
      attributes: ["id_opcion"],
      where: { id_usuario },
    });

    return res.json({
      success: true,
      data: votos,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" + error });
  }
};

export default { votar, haVotado };
