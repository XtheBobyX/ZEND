import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const User = sequelize.define(
  "users",
  {
    user_id: {
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
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    cover: {
      type: DataTypes.STRING,
    },
    biography: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default User;
