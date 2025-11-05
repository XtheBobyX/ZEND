import { Request, Response } from "express";

// Modelos
import "../utils/asocciationsModel";
import Multimedia from "../models/multimedia";
import Encuestas from "../models/encuesta";
import Post from "../models/post";
import Usuario from "../models/usuario";
import Opciones_encuesta from "../models/opciones_encuesta";

import { subirImagen } from "../../cloudinary/cloudinary";
import Like from "../models/likes";
import Saved_post from "../models/saved_post";
import Reposts from "../models/repost";
import Comentarios from "../models/comentarios";
import { Op } from "sequelize";

const postIncludes = [
  { model: Usuario },
  { model: Multimedia },
  {
    model: Encuestas,
    include: [{ model: Opciones_encuesta }],
  },
  { model: Like },
  { model: Reposts },
  { model: Comentarios },
];

const enviarPost = async (req: Request, res: Response) => {
  const { id_post, id_usuario, contenido, is_repost, multimedia, encuesta } =
    req.body;

  try {
    // Crear el post
    const post = (await Post.create({
      id_post,
      id_usuario,
      contenido,
      is_repost,
    })) as any;

    // Subir imágenes
    if (Array.isArray(multimedia)) {
      for (const imagen of multimedia) {
        const url = await subirImagen(imagen, "imagen", id_usuario);
        await Multimedia.create({
          id_post: post.id_post,
          id_usuario,
          url_archivo: url,
        });
      }
    }

    // Crear entrevista
    if (encuesta && encuesta.titulo.trim()) {
      const opciones = encuesta.opciones_encuesta || [];
      if (
        opciones.length >= 2 &&
        opciones.slice(0, 2).every((op: any) => op.texto.trim() !== "")
      ) {
        console.log(encuesta);
        console.log("xd");

        const newEncuesta = (await Encuestas.create({
          id_post: post.id_post,
          titulo: encuesta.titulo,
          multiple_opciones: encuesta.multiple_opciones,
        })) as any;

        console.log(encuesta);
        console.log("xd");

        // Crear opciones
        for (const opcion of opciones) {
          if (opcion.texto.trim() === "") {
            continue;
          }
          await Opciones_encuesta.create({
            id_encuesta: newEncuesta.id_encuesta,
            texto: opcion.texto,
          });
        }
      }
    }

    const postFull = await Post.findByPk(post.id_post, {
      include: postIncludes,
    });

    return res.json({ success: true, data: postFull });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error al crear el post" });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: postIncludes,
    });

    return res.json({ success: true, data: posts });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error al obtener posts" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: postIncludes,
    });
    return res.json({ success: true, data: post });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error al obtener posts" });
  }
};

const borrarPostById = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post no encontrado" });
    }

    await Reposts.destroy({ where: { id_post: id } });
    await Post.destroy({ where: { id_post_original: id } });
    await post?.destroy();

    return res.json({ success: true, action: "delete post" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error al obtener posts" });
  }
};

const like = async (req: Request, res: Response) => {
  try {
    const id_post = Number(req.params.id);
    const id_usuario = Number(req.body.id_usuario);

    if (isNaN(id_post) || isNaN(id_usuario)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    let like = await checkLike(id_usuario, id_post);

    if (like) {
      await like.destroy();
      return res.json({ success: true, action: "unliked", liked: false });
    }

    like = await Like.create({ id_usuario, id_post });
    return res.json({ success: true, action: "liked", liked: true });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

const checkLike = async (id_usuario: number, id_post: number) => {
  return await Like.findOne({ where: { id_usuario, id_post } });
};

const haveLike = async (req: Request, res: Response) => {
  try {
    const id_post = Number(req.params.id);
    const id_usuario = Number(req.query.usuario);

    if (isNaN(id_post) || isNaN(id_usuario)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const like = await checkLike(id_usuario, id_post);

    return res.json({ haveLike: !!like });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

const savePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.body;

    if (!id || !id_usuario) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    let post = await Saved_post.findOne({
      where: {
        id_usuario,
        id_post: id,
      },
    });

    if (post) {
      await post.destroy();
      return res.json({ success: true, saved: false });
    }

    post = await Saved_post.create({ id_usuario, id_post: id });
    return res.json({ success: true, saved: true });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

const haveSave = async (req: Request, res: Response) => {
  const { id } = req.params;
  const id_usuario = req.query.usuario;

  let save = await Saved_post.findOne({
    where: {
      id_usuario,
      id_post: id,
    },
  });

  return res.json({ haveSave: !!save });
};

const getPostByUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id no proporcionado" });
    }

    const post = await Post.findAll({
      where: {
        id_usuario: id,
      },
      include: postIncludes,
    });

    return res.json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los posts" });
  }
};

const getPostGuardados = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const postGuardados = await Saved_post.findAll({
      where: { id_usuario: id },
      include: [{ model: Post, include: postIncludes }],
    });

    if (!postGuardados) {
      return res.json({ success: true, message: "No hay post guardados" });
    }

    const posts = postGuardados.map((savePost) => (savePost as any).post);
    return res.json({ success: true, data: posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al obtener post guardados" + error });
  }
};

const repostear = async (req: Request, res: Response) => {
  try {
    const id_usuario = req.query.usuario;
    const { id } = req.params;

    const existe = await Reposts.findOne({
      where: { id_usuario, id_post: id },
    });
    if (existe) {
      return res.json({ message: "Ya existe un repost" });
    }
    const repost = await Reposts.create({
      id_usuario,
      id_post: id,
    });

    const newPost = await Post.create({
      id_usuario,
      contenido: null,
      id_post_original: id,
      is_repost: 1,
    });

    return res.json({ success: true, repost, newPost });
  } catch (error) {
    return res.status(500).json({ error: "Error al repostear" });
  }
};

const getComentarios = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comentarios = await Comentarios.findAll({
      where: { id_post: id },
      include: { model: Usuario },
    });
    return res.json({ success: true, data: comentarios });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

const comentar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_usuario, contenido } = req.body;

  if (!id_usuario || !contenido?.trim()) {
    return res.status(400).json({ error: "Datos invalidos" });
  }

  try {
    const comentario: any = await Comentarios.create({
      id_post: id,
      id_usuario,
      contenido,
    });

    const data = await Comentarios.findByPk(comentario.id_comentario, {
      include: { model: Usuario },
    });
    return res.json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json({ error: "Error interno" });
  }
};

const buscarPosts = async (req: Request, res: Response) => {
  const query = req.query.search as string;

  if (!query || query.trim() === "" || query === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Falta el parámetro de búsqueda (search)",
    });
  }

  try {
    const posts = await Post.findAll({
      where: {
        contenido: { [Op.like]: `%${query}%` },
      },
      include: postIncludes,
    });

    return res.json({ success: true, data: posts });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error al buscar posts " + error,
    });
  }
};

export default {
  enviarPost,
  getPosts,
  getPostById,
  like,
  haveLike,
  savePost,
  haveSave,
  // getLikesByUsuario,
  getPostByUsuario,
  getPostGuardados,
  repostear,
  getComentarios,
  comentar,
  borrarPostById,
  buscarPosts,
};
