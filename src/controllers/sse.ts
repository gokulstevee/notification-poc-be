import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";

export const sseClients = new Map<string, Response>();

export const notificationListener = (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) {
    res.status(401).end();
    return;
  }

  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  // Add client to map
  sseClients.set(userId, res);

  // Remove client on close
  req.on("close", () => {
    sseClients.delete(userId);
    res.end();
  });
};
