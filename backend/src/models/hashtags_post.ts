import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Hashtags_Post = sequelize.define(
  "hashtags_post",
  {
    hashtag_id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Posts",
        key: "id_post",
      },
    },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Hashtags_Post;
