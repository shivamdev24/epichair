import mongoose, { Schema, Document } from "mongoose";



interface IContact extends Document {
  username?: string; 
  email: string; 
  password?: string; 
}


const AdminSchema: Schema<IContact> = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide an Password"],
  },
});



const Admin =
  mongoose.models.Admin || mongoose.model<IContact>("Admin", AdminSchema);

export default Admin;
