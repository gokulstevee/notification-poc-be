import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response): Promise<any> => {
  const { userName, email, password, notificationPreferences } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      notificationPreferences,
    });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "1d",
      }
    );
    res.json({
      token,
      user: {
        _id: user.id,
        email: user.email,
        name: user.userName,
      },
    });
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({ message: "Error logging in" });
  }
};
