import mongoose, { Document, Model, Schema } from "mongoose";

interface IService extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema<IService> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
   
   
  },
  {
    timestamps: true, 
  }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
