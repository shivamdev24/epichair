import mongoose, { Document, Model, Schema } from "mongoose";

interface IService extends Document {
  name: string;
  description?: string;
  price?: number; // Added price field
  duration?: number; // Added duration field in minutes
  
}

const ServiceSchema: Schema<IService> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false, // Make this field required
      min: 0, // Ensure price is not negative
    },
    duration: {
      type: Number,
      required: false, // Make this field required
      min: 0, // Ensure duration is not negative
    },
   
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
