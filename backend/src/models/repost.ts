import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Reposts = sequelize.define("reposts", {
  id_usuario: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
    onDelete: "CASCADE",
  },
  id_post: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,

    references: {
      model: "posts",
      key: "id_post",
    },
    onDelete: "CASCADE",
  },
});

export default Reposts;
