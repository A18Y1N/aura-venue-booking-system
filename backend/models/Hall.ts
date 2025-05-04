import mongoose, { Document, Schema } from "mongoose";

export interface IHall extends Document {
  name: string;
  location: string;
  capacity: number;
}

const hallSchema = new Schema<IHall>(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IHall>("Hall", hallSchema);
