import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Hashtags = sequelize.define(
  "hashtags",
  {
    hashtag_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    hashtag: {
      type: DataTypes.TEXT,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Hashtags;
