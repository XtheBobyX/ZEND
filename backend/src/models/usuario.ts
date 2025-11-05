import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Usuario = sequelize.define("usuarios", {
  id_usuario: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_completo: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  portada: {
    type: DataTypes.STRING,
  },
  biografia: {
    type: DataTypes.STRING,
  },
});

export default Usuario;
