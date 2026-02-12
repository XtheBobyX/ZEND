import { Request, Response } from "express";

// Models
import "../utils/associationsModel";
import Multimedia from "../models/multimedia";
import Poll from "../models/poll";
import Post from "../models/post";
import User from "../models/user";
import PollOptions from "../models/poll_options";

import { uploadImage } from "../../cloudinary/cloudinary";
import Like from "../models/likes";
import SavedPost from "../models/saved_post";
import Reposts from "../models/repost";
import Comments from "../models/comments";
import { Op } from "sequelize";

const postIncludes = [
  { model: User },
  { model: Multimedia },
  {
    model: Poll,
    include: [{ model: PollOptions }],
  },
  { model: Like },
  // { model: Reposts },
  { model: Comments },
];

const createPost = async (req: Request, res: Response) => {
  const { post_id, user_id, content, is_repost, multimedia, poll } = req.body;

  try {
    const post = (await Post.create({
      post_id,
      user_id,
      content,
      is_repost,
    })) as any;

    // Upload images
    if (Array.isArray(multimedia)) {
      for (const image of multimedia) {
        const url = await uploadImage(image, "image", user_id);
        await Multimedia.create({
          post_id: post.post_id,
          user_id,
          file_url: url,
        });
      }
    }

    // Create poll
    if (poll && poll.title.trim()) {
      const options = poll.poll_options || [];
      if (
        options.length >= 2 &&
        options.slice(0, 2).every((op: any) => op.content.trim() !== "")
      ) {
        const newPoll = (await Poll.create({
          post_id: post.post_id,
          title: poll.title,
          multiple_choices: poll.multiple_choices,
        })) as any;

        for (const option of options) {
          if (option.content.trim() === "") continue;

          await PollOptions.create({
            poll_id: newPoll.poll_id,
            content: option.content,
          });
        }
      }
    }

    const fullPost = await Post.findByPk(post.post_id, {
      include: postIncludes,
    });

    return res.json({ success: true, data: fullPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error creating post" });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.findAll({
      include: postIncludes,
    });
    return res.json({ success: true, data: posts });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error fetching posts" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: postIncludes,
    });
    return res.json({ success: true, data: post });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error fetching post" });
  }
};

const deletePostById = async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log(id);
  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // await Reposts.destroy({ where: { id_post: id } });
    await Post.destroy({ where: { original_post_id: id } });
    await post.destroy();

    return res.json({ success: true, action: "delete post" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error deleting post" });
  }
};

const toggleLike = async (req: Request, res: Response) => {
  try {
    const post_id = Number(req.params.id);
    const user_id = Number(req.body.user_id);

    if (isNaN(post_id) || isNaN(user_id)) {
      return res.status(400).json({ error: "Invalid IDs" });
    }

    let like = await checkLike(user_id, post_id);

    if (like) {
      await like.destroy();
      return res.json({ success: true, action: "unliked", liked: false });
    }

    like = await Like.create({ user_id, post_id });
    return res.json({ success: true, action: "liked", liked: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
};

const checkLike = async (user_id: number, post_id: number) => {
  return await Like.findOne({ where: { user_id, post_id } });
};

const hasLike = async (req: Request, res: Response) => {
  try {
    const post_id = Number(req.params.id);
    const user_id = Number(req.query.user);

    if (isNaN(post_id) || isNaN(user_id)) {
      return res.status(400).json({ error: "Invalid IDs" });
    }

    const like = await checkLike(user_id, post_id);

    return res.json({ hasLike: !!like });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
};

const toggleSavePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ error: "Incomplete data" });
    }

    let saved = await SavedPost.findOne({
      where: { user_id, post_id: id },
    });

    if (saved) {
      await saved.destroy();
      return res.json({ success: true, saved: false });
    }

    saved = await SavedPost.create({ user_id, post_id: id });
    return res.json({ success: true, saved: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal error" + error });
  }
};

const hasSavedPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = req.query.user;

  const saved = await SavedPost.findOne({
    where: { user_id, post_id: id },
  });

  return res.json({ hasSaved: !!saved });
};

const getPostsByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID not provided" });
    }

    const posts = await Post.findAll({
      where: { user_id: id },
      include: postIncludes,
    });

    return res.json({ success: true, data: posts });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching posts" });
  }
};

const getSavedPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const savedPosts = await SavedPost.findAll({
      where: { user_id: id },
      include: [{ model: Post, include: postIncludes }],
    });

    const posts = savedPosts.map((sp: any) => sp.post);
    return res.json({ success: true, data: posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching saved posts " + error });
  }
};

const repost = async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user;
    const { id } = req.params;

    const existRepost = await Post.findOne({
      where: { user_id, original_post_id: id },
    });

    if (existRepost) {
      return res.json({ message: "Repost already exists" });
    }

    const newPost = await Post.create({
      user_id,
      content: null,
      original_post_id: id,
      is_repost: 1,
    });

    return res.json({ success: true, repost, newPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error reposting" });
  }
};

const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comments = await Comments.findAll({
      where: { post_id: id },
      include: { model: User },
    });
    return res.json({ success: true, data: comments });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching comments" });
  }
};

const addComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, content } = req.body;

  if (!user_id || !content?.trim()) {
    return res.status(400).json({ error: "Invalid data" });
  }

  try {
    const comment: any = await Comments.create({
      post_id: id,
      user_id,
      content,
    });

    const data = await Comments.findByPk(comment.comment_id, {
      include: { model: User },
    });

    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
};

const searchPosts = async (req: Request, res: Response) => {
  const query = req.query.search as string;

  if (!query || query.trim() === "" || query === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Missing search parameter",
    });
  }

  try {
    const posts = await Post.findAll({
      where: {
        content: { [Op.like]: `%${query}%` },
      },
      include: postIncludes,
    });

    return res.json({ success: true, data: posts });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error searching posts " + error,
    });
  }
};

export default {
  createPost,
  getPosts,
  getPostById,
  toggleLike,
  hasLike,
  toggleSavePost,
  hasSavedPost,
  getPostsByUser,
  getSavedPosts,
  repost,
  getComments,
  addComment,
  deletePostById,
  searchPosts,
};
