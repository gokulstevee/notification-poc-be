import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { sseClients } from "../controllers/sse";
import User from "../models/User";
import { NotificationPreference } from "../types";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const sendToQueue = async (queueUrl: string, messageBody: any) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  };

  const command = new SendMessageCommand(params);
  return sqsClient.send(command);
};

export const startNotificationSqsConsumer = async (queueUrl: string) => {
  while (true) {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 3,
      });
      const data = await sqsClient.send(command);

      if (data.Messages) {
        for (const msg of data.Messages) {
          const body = JSON.parse(msg.Body || "{}");
          const targetUser = body.targetUser?.toString();

          // If user is connected via SSE, send the message
          if (targetUser && sseClients.has(targetUser)) {
            // Fetch user from DB
            const user = await User.findById(targetUser);

            if (
              user &&
              Array.isArray(user.notificationPreferences) &&
              user.notificationPreferences.includes(
                NotificationPreference.IN_APP
              )
            ) {
              const res = sseClients.get(targetUser)!;
              res.write(`data: ${JSON.stringify(body)}\n\n`);

              // Delete message from queue since it was delivered
              if (msg.ReceiptHandle) {
                console.log("SQS Message Deleted...");

                await sqsClient.send(
                  new DeleteMessageCommand({
                    QueueUrl: queueUrl,
                    ReceiptHandle: msg.ReceiptHandle,
                  })
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("SQS Consumer error:", error);
    }
  }
};
