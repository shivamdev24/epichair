import mongoose, { Schema, Document } from "mongoose";

// Define the Appointment interface
export interface IAppointment extends Document {
  barber: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  appointmentType: "inApp" | "WalkIn"; // Appointment type field
  feedback?: string;
  rating?: number; // Optional rating (1-5)
}

// Define the appointment schema
const AppointmentSchema: Schema = new Schema({
  barber: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Types.ObjectId, ref: "Service" , required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  appointmentType: {
    type: String,
    enum: ["inApp", "WalkIn"], // Enum for appointment types
    default: "inApp", // Set default value to "inApp"
  },
  feedback: { type: String },
  rating: { type: Number, min: 1, max: 5 },
});

// Create the Appointment model
const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
