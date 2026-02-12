import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Saved_post = sequelize.define(
  "saved_posts",
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
    updatedAt: "updated_at",
  },
);

export default Saved_post;
