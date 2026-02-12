import Comments from "../models/comments";
import Poll from "../models/poll";
import Like from "../models/likes";
import Messages from "../models/message";
import Multimedia from "../models/multimedia";
import Poll_options from "../models/poll_options";
import Post from "../models/post";
import Reposts from "../models/repost";
import Saved_post from "../models/saved_post";
import Followers from "../models/followers";
import User from "../models/user";

// POST & USERS
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

// POST & MULTIMEDIA & USER
Post.hasMany(Multimedia, { foreignKey: "post_id" });
User.hasMany(Multimedia, { foreignKey: "user_id" });
Multimedia.belongsTo(Post, { foreignKey: "post_id" });

// POLL & POST
Poll.belongsTo(Post, { foreignKey: "post_id" });
Post.hasOne(Poll, { foreignKey: "post_id" });

// POLL & POLL_OPTIONS
Poll.hasMany(Poll_options, { foreignKey: "poll_id" });
Poll_options.belongsTo(Poll, { foreignKey: "poll_id" });

// LIKES & POST
Post.hasMany(Like, { foreignKey: "post_id" });
Like.belongsTo(Post, { foreignKey: "post_id" });

// SAVED POSTS
Post.hasMany(Saved_post, { foreignKey: "post_id" });
Saved_post.belongsTo(Post, { foreignKey: "post_id" });

// REPOSTS
Post.hasMany(Reposts, { foreignKey: "post_id" });
Reposts.belongsTo(Post, { foreignKey: "post_id" });

// COMMENTS
Post.hasMany(Comments, { foreignKey: "post_id" });
Comments.belongsTo(Post, { foreignKey: "post_id" });

User.hasMany(Comments, { foreignKey: "user_id" });
Comments.belongsTo(User, { foreignKey: "user_id" });

// FOLLOWERS
User.hasMany(Followers, { foreignKey: "follower_id", as: "following" });
Followers.belongsTo(User, { foreignKey: "follower_id", as: "follower" });

User.hasMany(Followers, { foreignKey: "followed_id", as: "followers" });
Followers.belongsTo(User, { foreignKey: "followed_id", as: "followed" });

// USERS & MESSAGES
User.hasMany(Messages, { foreignKey: "sender_id", as: "sent_messages" });
Messages.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

User.hasMany(Messages, { foreignKey: "receiver_id", as: "received_messages" });
Messages.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });
