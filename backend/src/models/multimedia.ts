import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Multimedia = sequelize.define(
  "multimedia",
  {
    multimedia_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "post_id",
      },
      onDelete: "CASCADE",
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Multimedia;
