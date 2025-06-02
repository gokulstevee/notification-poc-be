import mongoose, { Schema, Document } from "mongoose";
import { NotificationPreference } from "../types";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  notificationPreferences: NotificationPreference[];
}

const UserSchema: Schema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notificationPreferences: {
    type: [String],
    enum: Object.values(NotificationPreference),
    default: [NotificationPreference.IN_APP],
  },
});

export default mongoose.model<IUser>("User", UserSchema);
