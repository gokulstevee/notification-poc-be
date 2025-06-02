import { Router } from "express";
import { likePost } from "../../controllers/postLike";
import { authMiddleware } from "../../middleware/auth";

const postLikeRouter: Router = Router();

postLikeRouter.post("/", authMiddleware, likePost);

export default postLikeRouter;
