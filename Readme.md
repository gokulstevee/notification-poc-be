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

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/gokulstevee/notification-poc-be.git
cd notification-poc-be
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_uri
PORT=8000
JWT_SECRET=your_jwt_secret

AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_SQS_QUEUE_URL=your_sqs_queue_url

FRONT_END_URLS=http://localhost:5173,https://notification-poc-fe.vercel.app/
```

### 4. Run the server

```sh
npm run start
```

The server will run on `http://localhost:8000` by default.

---

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
