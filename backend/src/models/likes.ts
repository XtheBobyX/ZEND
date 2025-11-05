import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Like = sequelize.define("likes", {
  id_usuario: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
  },
  id_post: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "posts",
      key: "id_post",
    },
  },
});

export default Like;
