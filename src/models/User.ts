import mongoose, { Schema, Document, Types } from "mongoose";

// Define the User interface
export interface User extends Document {
  _id: Types.ObjectId;
  email: string;
  username?: string;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  role: "user" | "staff" | "admin";
  password?: string;
  feedback?: string; // Optional feedback field
  rating?: number; // Optional rating field
  services?: string[]; // Optional services field
  // skills?: string[]; // Optional skills field
}

// Define the user schema
const userSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: false,
  },
  otpExpiry: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    required: true,
  },
  password: {
    type: String,
    required: function (this: User) {
      return this.role === "admin";
    },
  },
  feedback: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  services: {
    type: [String], // Array of strings for services
    required: false, // Not required
  },
  // skills: {
  //   type: [String], // Array of strings for skills
  //   required: false, // Not required
  // },
});

// Create the User model
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
