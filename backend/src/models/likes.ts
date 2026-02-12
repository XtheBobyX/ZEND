import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Like = sequelize.define(
  "likes",
  {
    user_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    post_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "posts",
        key: "post_id",
      },
    },
  },
  {
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default Like;
