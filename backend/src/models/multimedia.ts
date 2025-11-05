import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Multimedia = sequelize.define("multimedia", {
  id_multimedia: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  id_post: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "posts",
      key: "id_post",
    },
    onDelete: "CASCADE",
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
  url_archivo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Multimedia;
