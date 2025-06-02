# Notification System Backend

This is a Node.js (Express) backend for the Notification System.  
It supports user authentication, post creation, post likes, real-time notifications via Server-Sent Events (SSE), and AWS SQS integration for scalable notification delivery.

---

## Features

- **User Registration & Login** (JWT-based)
- **Post Creation & Listing** (with pagination)
- **Post Likes** (with like count and duplicate prevention)
- **Notification Preferences** (in-app, email, push-notification)
- **Real-time In-App Notifications** via SSE
- **AWS SQS Integration** for scalable notification queueing
- **MongoDB** for persistent storage

---

## Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- AWS SQS
- Server-Sent Events (SSE)
- TypeScript

## API Endpoints

### Auth

- `POST /api/v1/auth/register` — Register a new user
- `POST /api/v1/auth/login` — Login and receive JWT

### Posts

- `POST /api/v1/posts` — Create a post (auth required)
- `GET /api/v1/posts?pageNumber=1&pageSize=10` — List posts with pagination

### Post Likes

- `POST /api/v1/post-likes` — Like a post (auth required)

### SSE Notifications

- `GET /api/v1/sse/events` — Listen for real-time notifications (auth required, JWT in header)

---

## Notification Flow

1. User likes a post.
2. A notification message is sent to AWS SQS.
3. The backend SQS consumer checks if the post owner is connected via SSE and has "in-app" notifications enabled.
4. If so, the notification is pushed in real-time; otherwise, the message remains in the queue until the user connects.
