import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Opciones_encuesta = sequelize.define("opciones_encuesta", {
  id_opcion: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  id_encuesta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "encuestas",
      key: "id_encuesta",
    },
    onDelete: "CASCADE",
  },
  texto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Opciones_encuesta;
