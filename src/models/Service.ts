import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for the Service document
interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the service
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
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically include `createdAt` and `updatedAt` fields
  }
);

// Export the model with the IService type
const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
