import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Comments = sequelize.define(
  "comments",
  {
    comments_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "posts",
        key: "post_id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Comments;
