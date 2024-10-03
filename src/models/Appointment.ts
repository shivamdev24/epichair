import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  barber: mongoose.Types.ObjectId; 
  user: mongoose.Types.ObjectId; 
  service: string; 
  appointmentDate: Date; 
  appointmentTime: string; 
  status: "pending" | "confirmed" | "completed" | "cancelled";
  feedback?: string;
  rating?: number; // Optional rating (1-5)
}

const AppointmentSchema: Schema = new Schema({
  barber: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  feedback: { type: String }, 
  rating: { type: Number, min: 1, max: 5 }, 
});

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default Appointment;
