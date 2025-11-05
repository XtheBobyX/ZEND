import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Hashtags = sequelize.define("hashtags", {
  id_hashtag: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  hashtag: {
    type: DataTypes.TEXT,
  },
});

export default Hashtags;
