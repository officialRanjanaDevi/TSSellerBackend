import mongoose, { Document, Schema } from "mongoose";

interface IAppointment extends Document {
  purpose: string;
  userId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
}

const AppointmentSchema: Schema = new Schema(
  {
    purpose: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "product", required: true }],
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model<IAppointment>(
  "MeetRequest",
  AppointmentSchema
);
export default Appointment;
