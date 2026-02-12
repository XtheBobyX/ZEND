import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Follower = sequelize.define("followers", {
  follower_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "user_id",
    },
  },
  followed_id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "user_id",
    },
  },
},{
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Follower;
