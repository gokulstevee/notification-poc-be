import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/v1/auth";
import postLikeRouter from "./routes/v1/postLike";
import { sseRouter } from "./routes/v1/sse";
import { startNotificationSqsConsumer } from "./services/sqsService";
import postRouter from "./routes/v1/post";

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "", {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/v1", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/posts-like", postLikeRouter);

// Server sent events
app.use("/sse/v1", sseRouter);
const notificationQueueUrl = process.env.AWS_SQS_QUEUE_URL || "";
startNotificationSqsConsumer(notificationQueueUrl);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
