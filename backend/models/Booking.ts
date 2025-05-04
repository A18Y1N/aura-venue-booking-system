import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  hallId: string;
  userId: string;
  userName: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string; // ✅ added
}

const BookingSchema = new Schema<IBooking>(
  {
    hallId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    purpose: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    attendees: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String }, // ✅ added
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
