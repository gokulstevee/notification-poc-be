import { Request, Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { content } = req.body;
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = new Post({
      content,
      createdBy: userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const skip = (pageNumber - 1) * pageSize;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("createdBy", "email userName")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const mappedPosts = posts.map((post) => {
      return {
        id: post._id,
        content: post.content,
        createdBy:
          post.createdBy &&
          typeof post.createdBy === "object" &&
          "userName" in post.createdBy
            ? (post.createdBy as { userName: string }).userName
            : post.createdBy,
        createdAt: post.createdAt,
        likes: post.likes,
      };
    });

    res.status(200).json({
      posts: mappedPosts,
      pageNumber,
      pageSize,
      total: totalPosts,
      totalPages: Math.ceil(totalPosts / pageSize),
    });
  } catch (error) {
    console.log("Error: ", error);

    res.status(500).json({ message: "Failed to fetch posts" });
  }
};
