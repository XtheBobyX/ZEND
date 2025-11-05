import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Seguidores = sequelize.define("seguidores", {
  id_seguidor: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
  },
  id_seguido: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id_usuario",
    },
  },
});

export default Seguidores;
