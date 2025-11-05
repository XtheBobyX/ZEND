import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Votos_encuestas = sequelize.define("votos_encuestas", {
  id_voto: {
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
  id_opcion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "opciones_encuesta",
      key: "id_encuesta",
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
});

export default Votos_encuestas;
