import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Mensajes = sequelize.define("mensajes", {
  id_mensaje: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  id_remitente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
    onDelete: "CASCADE",
  },
  id_receptor: {
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
    allowNull: false,
  },
});

export default Mensajes;
