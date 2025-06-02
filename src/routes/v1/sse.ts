import { Router } from "express";
import { notificationListener } from "../../controllers/sse";
import { authMiddleware } from "../../middleware/auth";

const sseRouter = Router();

sseRouter.get("/events/notification", authMiddleware, notificationListener);

export { sseRouter };
