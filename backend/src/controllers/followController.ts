import { Request, Response } from "express";

// Models
import "../utils/associationsModel";
import Followers from "../models/followers";
import User from "../models/user";
import { Sequelize } from "sequelize";

const toggleFollow = async (req: Request, res: Response) => {
  try {
    // Validations
    const { follower_id, followed_id } = req.body;

    if (!follower_id || !followed_id) {
      return res.status(400).json({ error: "Missing follower/followed IDs" });
    }

    if (follower_id === followed_id) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    let isFollowing = await Followers.findOne({
      where: {
        follower_id: follower_id,
        followed_id: followed_id,
      },
    });

    if (isFollowing) {
      await isFollowing.destroy();
      return res.json({
        success: true,
        action: "stop following",
        data: isFollowing,
        isFollowing: false,
      });
    }

    // Follow user
    isFollowing = await Followers.create({
      follower_id: follower_id,
      followed_id: followed_id,
    });

    return res.json({
      success: true,
      action: "follow",
      data: isFollowing,
      isFollowing: true,
    });
  } catch (error) {
    console.error("toggleFollow error:", error);
    return res.status(500).json({ success: false, error: "Internal error" });
  }
};

const hasFollow = async (req: Request, res: Response) => {
  try {
    const follower = Number(req.query.follower);
    const followed = Number(req.query.followed);

    if (isNaN(follower) || isNaN(followed)) {
      return res.status(400).json({ error: "Invalid IDs" });
    }

    const isFollowing = await Followers.findOne({
      where: {
        follower_id: follower,
        followed_id: followed,
      },
    });

    console.log(isFollowing);

    return res.json({ data: !!isFollowing });
  } catch (error) {
    return res.status(500).json({ error: "Error checking follow status" });
  }
};

const topPopularUsers = async (req: Request, res: Response) => {
  try {
    const followers = await Followers.findAll({
      attributes: [
        "followed_id",
        [Sequelize.fn("COUNT", Sequelize.col("follower_id")), "count"],
      ],
      group: ["followed_id"],
      order: [[Sequelize.literal("count"), "DESC"]],
      limit: 5,
      include: [
        {
          model: User,
          as: "followed",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
      ],
    });

    const topUsers = followers.map((f: any) => f.followed);
    return res.json({ success: true, data: topUsers });
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
};

const getFollowers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    const followers = await Followers.findAndCountAll({
      where: { followed_id: id },
      include: [
        {
          model: User,
          as: "follower",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
      ],
    });

    return res.json({ success: true, data: followers });
  } catch (error) {
    res.json("Error: " + error);
  }
};

const getFollowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const following = await Followers.findAndCountAll({
      where: { follower_id: id },
      include: [
        {
          model: User,
          as: "followed",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
      ],
    });

    return res.json({ success: true, data: following });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error fetching following users: " + error });
  }
};

export default {
  toggleFollow,
  hasFollow,
  topPopularUsers,
  getFollowers,
  getFollowing,
};
