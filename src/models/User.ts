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
  feedback?: string; 
  rating?: number; 
  services?: string[]; 
  image_url?: string;
  public_id?: string;
}

// Define the user schema
const UserSchema: Schema<User> = new mongoose.Schema(
  {
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
    image_url: { type: String, required: false }, // Define imageUrl field
    public_id: { type: String, required: false }, // Define imageUrl field
    // skills: {
    //   type: [String], // Array of strings for skills
    //   required: false, // Not required
    // },
  },
  { timestamps: true }
);

// Create the User model
const User =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);


export default User;


