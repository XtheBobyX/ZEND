import Comentarios from "../models/comentarios";
import Encuesta from "../models/encuesta";
import Like from "../models/likes";
import Mensajes from "../models/mensajes";
import Multimedia from "../models/multimedia";
import Opciones_encuesta from "../models/opciones_encuesta";
import Post from "../models/post";
import Reposts from "../models/repost";
import Saved_post from "../models/saved_post";
import Seguidores from "../models/seguidores";
import Usuario from "../models/usuario";

// POST & USUARIOS
Usuario.hasMany(Post, { foreignKey: "id_usuario" });
Post.belongsTo(Usuario, { foreignKey: "id_usuario" });

// POST & MULTIMEDIA & USUARIO
Post.hasMany(Multimedia, { foreignKey: "id_post" });
Usuario.hasMany(Multimedia, { foreignKey: "id_usuario" });
Multimedia.belongsTo(Post, { foreignKey: "id_post" });

// ENCUESTA & POST
Encuesta.belongsTo(Post, { foreignKey: "id_post" });
Post.hasOne(Encuesta, { foreignKey: "id_post" });

// ENCUESTA & OPCIONES_ENCUESTA
Encuesta.hasMany(Opciones_encuesta, { foreignKey: "id_encuesta" });
Opciones_encuesta.belongsTo(Encuesta, { foreignKey: "id_encuesta" });

// LIKES & POST
Post.hasMany(Like, { foreignKey: "id_post" });
Like.belongsTo(Post, { foreignKey: "id_post" });

// SAVE POSTS
Post.hasMany(Saved_post, { foreignKey: "id_post" });
Saved_post.belongsTo(Post, { foreignKey: "id_post" });

//
Post.hasMany(Reposts, { foreignKey: "id_post" });
Reposts.belongsTo(Post, { foreignKey: "id_post" });

//
Post.hasMany(Comentarios, { foreignKey: "id_post" });
Comentarios.belongsTo(Post, { foreignKey: "id_post" });

//
Usuario.hasMany(Comentarios, { foreignKey: "id_usuario" });
Comentarios.belongsTo(Usuario, { foreignKey: "id_usuario" });

//
Usuario.hasMany(Seguidores, { foreignKey: "id_seguidor", as: "seguidos" });
Seguidores.belongsTo(Usuario, { foreignKey: "id_seguidor", as: "seguidor" });

Usuario.hasMany(Seguidores, { foreignKey: "id_seguido", as: "seguidores" });
Seguidores.belongsTo(Usuario, { foreignKey: "id_seguido", as: "seguido" });

// USUARIOS & MENSAJES

Usuario.hasMany(Mensajes, {
  foreignKey: "id_remitente",
  as: "mensajes_enviados",
});

Mensajes.belongsTo(Usuario, { foreignKey: "id_remitente", as: "remitente" });

Usuario.hasMany(Mensajes, {
  foreignKey: "id_receptor",
  as: "mensajes_recibidos",
});
Mensajes.belongsTo(Usuario, { foreignKey: "id_receptor", as: "receptor" });
