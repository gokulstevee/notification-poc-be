import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPostLike extends Document {
  likedBy: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
}

const PostLikeSchema: Schema = new Schema({
  likedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPostLike>("PostLike", PostLikeSchema);
