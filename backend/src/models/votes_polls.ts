import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Votes_polls = sequelize.define(
  "votes_polls",
  {
    vote_id: {
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
    option_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "poll_options",
        key: "option_id",
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
  },
  {
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default Votes_polls;
