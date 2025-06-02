import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { createPost, getAllPosts } from "../../controllers/post";

const postRouter: Router = Router();

postRouter.post("/", authMiddleware, createPost);
postRouter.get("/", authMiddleware, getAllPosts);

export default postRouter;
