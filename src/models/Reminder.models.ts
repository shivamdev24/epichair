import mongoose, { Schema, Document } from "mongoose";

interface IReminder extends Document {
  date: string,
  time: string,
}

const ReminderSchema: Schema<IReminder> = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const Reminder =
  mongoose.models.Reminder ||
  mongoose.model<IReminder>("Reminder", ReminderSchema);

export default Reminder;
