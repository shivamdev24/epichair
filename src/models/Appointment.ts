import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  barber: mongoose.Types.ObjectId; // Reference to the barber/staff
  user: mongoose.Types.ObjectId; // Reference to the user who booked the appointment
  service: string; // Type of service for the appointment
  appointmentDate: Date; // Appointment date
  appointmentTime: string; // Appointment time (could use a more granular type if needed)
  status: "pending" | "confirmed" | "completed" | "cancelled"; // Appointment status
  feedback?: string; // Optional feedback provided by the user
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
  feedback: { type: String }, // Optional feedback field
  rating: { type: Number, min: 1, max: 5 }, // Optional rating field (1-5)
});

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
export default Appointment;
