import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { uploadImage } from "../../cloudinary/cloudinary";
import { Op } from "sequelize";
import { generateToken, validateToken } from "../middlewares/auth";

// Register a new user
const registerUser = async (req: Request, res: Response) => {
  console.log(req.body);

  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // TODO: JWT implementation
    const plainUser = user.get({ plain: true });

    const token = generateToken(plainUser);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .header("authorization", token)
      .json({
        message: "Logged-in user",
        token,
      });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error });
  }
};

// Login existing user
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validations
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Find user
    const user = await User.findOne({
      where: { username },
      attributes: ["user_id", "username", "password"],
    });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Compare passwords
    const hashedPassword = user.getDataValue("password");
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Successful login
    const userData = user.get({ plain: true });
    const { password: _, ...userWithoutPassword } = userData;

    // Generate JWT
    const token = generateToken(userData);

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      })
      .header("authorization", token)
      .json({
        message: "User logged in",
        token,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
  }
};

// Get all users
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    return res
      .status(500)
      .json({ error: "Error fetching users", details: error });
  }
};

// Update user profile
const customizeProfile = async (req: Request, res: Response) => {
  const { username, full_name, biography, avatar, cover } = req.body;

  let avatarUpload: string | null = null;
  let coverUpload: string | null = null;

  // Upload images if provided
  if (!avatar.startsWith("data:image/svg+xml")) {
    avatarUpload = await uploadImage(avatar, "avatar", username);
  }

  if (cover !== "/src/assets/img/background.jpg") {
    coverUpload = await uploadImage(cover, "cover", username);
  }

  try {
    const updatedUser = await User.update(
      {
        full_name,
        biography,
        avatar: avatarUpload,
        cover: coverUpload,
      },
      { where: { username } },
    );

    return res.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Error updating profile:", error);
    return res.status(500).json({ error: "Error updating profile" });
  }
};

// Get user by ID
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  res.json(user);
};

// Get user by username
const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await User.findOne({ where: { username } });
  res.json(user);
};

// Search users by username or full name
const searchUsers = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  if (!query || query.trim() === "" || query === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Missing search parameter",
    });
  }
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: {
          username: { [Op.like]: `%${query}%` },
          full_name: { [Op.like]: `%${query}%` },
        },
      },
    });

    return res.json({ success: true, data: users });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error searching users: " + error,
    });
  }
};

export default {
  getUsers,
  registerUser,
  customizeProfile,
  login,
  getUserById,
  getUserByUsername,
  searchUsers,
};
