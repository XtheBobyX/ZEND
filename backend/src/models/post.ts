import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Post = sequelize.define(
  "posts",
  {
    post_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
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
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_repost: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    original_post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "posts",
        key: "post_id",
      },
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Post;
