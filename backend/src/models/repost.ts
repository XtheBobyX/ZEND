import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Reposts = sequelize.define(
  "reposts",
  {
    user_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    post_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: "posts",
        key: "post_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Reposts;
