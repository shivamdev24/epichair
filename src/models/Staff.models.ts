import mongoose, { Schema, Document } from "mongoose";

interface IStaff extends Document {
  Name?: string;
  email: string;
  otp?: string;
}

const StaffSchema: Schema<IStaff> = new mongoose.Schema({
  Name: {
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

const Staff =
  mongoose.models.Staff || mongoose.model<IStaff>("User", StaffSchema);

export default Staff;
