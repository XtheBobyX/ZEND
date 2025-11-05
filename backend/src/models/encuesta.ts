import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Encuesta = sequelize.define("encuestas", {
  id_encuesta: {
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
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  multiple_opciones: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Encuesta;
