import "../utils/associationsModel";

import { Request, Response } from "express";
import Messages from "../models/message";
import User from "../models/user";
import { Op } from "sequelize";
import sequelize from "../../connection";

const getUserList = async (req: Request, res: Response) => {
  const userId = Number(req.query.user);

  try {
    const conversations = await Messages.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
      attributes: [
        [
          sequelize.literal(
            `CASE WHEN sender_id = ${userId} THEN receiver_id ELSE sender_id END`,
          ),
          "user_id",
        ],
      ],
      group: ["user_id"],
      raw: true,
    });

    const ids = conversations.map((c: any) => c.user_id);

    const users = await User.findAll({
      where: { user_id: ids },
      attributes: ["user_id", "username", "full_name", "avatar"],
    });

    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error getting user list: ${error}`,
    });
  }
};

const getConversations = async (req: Request, res: Response) => {
  const { user1, user2 } = req.body;
  if (!user1 || !user2) {
    return res
      .status(404)
      .json({ success: false, msg: "User IDs are required" });
  }

  try {
    const conversations = await Messages.findAll({
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
      ],
      where: {
        [Op.or]: [
          {
            [Op.and]: [{ sender_id: user1 }, { receiver_id: user2 }],
          },
          {
            [Op.and]: [{ sender_id: user2 }, { receiver_id: user1 }],
          },
        ],
      },
      order: [["created_at", "ASC"]],
    });

    return res.json({ success: true, data: conversations });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: `Error getting conversations: ${error}`,
    });
  }
};

const sendMessage = async (req: Request, res: Response) => {
  const { receiver_id, sender_id, content } = req.body;
  console.log(req.body);

  if (!receiver_id || !sender_id || !content) {
    return res.status(404).json({ success: false, msg: "Invalid data" });
  }

  try {
    const newMessage: any = await Messages.create({
      receiver_id,
      sender_id,
      content,
    });

    const fullMessage = await Messages.findByPk(newMessage.message_id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["user_id", "username", "full_name", "avatar"],
        },
      ],
    });

    return res.json({ success: true, data: fullMessage });
  } catch (error) {
    res.json({
      success: false,
      error: `Error sending message: ${error}`,
    });
  }
};

export default {
  getConversations,
  getUserList,
  sendMessage,
};
