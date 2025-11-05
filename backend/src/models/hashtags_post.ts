import { DataTypes } from "sequelize";
import sequelize from "../../connection";

const Hashtags_Post = sequelize.define("hashtags_post", {
  id_hashtag: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  id_post: {
    type: DataTypes.INTEGER,
    references: {
      model: "Posts",
      key: "id_post",
    },
  },
});

export default Hashtags_Post;
