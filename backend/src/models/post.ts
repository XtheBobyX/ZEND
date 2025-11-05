import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Post = sequelize.define("posts", {
  id_post: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
    onDelete: "CASCADE",
  },
  contenido: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_repost: {
    type: DataTypes.BOOLEAN,
  },
  id_post_original: {
    type: DataTypes.INTEGER,
    references: {
      model: "posts",
      key: "id_post",
    },
  },
});

export default Post;
