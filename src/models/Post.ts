import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  likes: number;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

export default mongoose.model<IPost>("Post", PostSchema);
