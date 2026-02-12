import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Poll_options = sequelize.define(
  "poll_options",
  {
    option_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    poll_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "polls",
        key: "poll_id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Poll_options;
