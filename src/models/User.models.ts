import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username?: string;
  email: string;
  otp?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
  },

  otp: {
    type: String,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
