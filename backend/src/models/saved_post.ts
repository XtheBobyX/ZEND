import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Saved_post = sequelize.define(
  "saved_post",
  {
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
  },
  {
    tableName: "saved_post",
  }
);

export default Saved_post;
