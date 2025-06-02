import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import PostLike from "../models/PostLike";
import Post from "../models/Post";
import { NotificationTypes } from "../types";
import User from "../models/User";
import { sendToQueue } from "../services/sqsService";
import { v4 as uuidv4 } from "uuid";

export const likePost = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post Id is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({ message: "Invalid post" });
    }

    // Prevent post owner from liking their own post
    if (post.createdBy.toString() == userId) {
      return res
        .status(400)
        .json({ message: "You cannot like your own post." });
    }

    // Prevent duplicate likes
    const existingLike = await PostLike.findOne({ likedBy: userId, postId });
    if (existingLike) {
      return res.status(400).json({ message: "Already liked" });
    }

    const like = new PostLike({
      likedBy: userId,
      postId,
    });

    await like.save();

    // Increment the likes count in the Post document
    await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

    // Fetch the liker user details
    const liker = await User.findById(userId);

    if (post && post.createdBy && liker) {
      const queueUrl = process.env.AWS_SQS_QUEUE_URL || "";

      const messageContent = `Your post "${post.title ?? "-"}", was liked by ${
        liker.userName
      }.`;

      const message = {
        id: uuidv4(),
        type: NotificationTypes.LIKE_NOTIFICATION,
        content: messageContent,
        targetUser: post.createdBy,
        createdAt: new Date(),
      };

      sendToQueue(queueUrl, message).catch((error) => {
        console.log("SQS send message error: ", error);
      }); // here execution don't want to wait until send to sqs queue
    }

    res.status(201).json(like);
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({ message: "Failed to like post" });
  }
};
