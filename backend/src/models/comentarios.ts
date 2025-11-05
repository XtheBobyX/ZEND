import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Comentarios = sequelize.define("comentarios", {
  id_comentario: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  id_post: {
    type: DataTypes.INTEGER,
    references: {
      model: "posts",
      key: "id_post",
    },
    onDelete: "CASCADE",
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
    onDelete: "CASCADE",
  },
  contenido: {
    type: DataTypes.STRING,
  },
});

export default Comentarios;
