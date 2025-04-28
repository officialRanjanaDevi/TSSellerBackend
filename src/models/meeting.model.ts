import mongoose, { Document, Schema } from "mongoose";

interface IMeeting extends Document {
  title: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  date: Date;
  time: string;
  zoom_meeting_id: string;
  zoom_meeting_password: string;
  sellerId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  users: mongoose.Types.ObjectId[];
  products: mongoose.Types.ObjectId[];
}

const MeetingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    zoom_meeting_id: { type: String, required: true },
    zoom_meeting_password: { type: String, required: true },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "SellerSchema",
      required: true,
    },
    storeId: { type: Schema.Types.ObjectId, ref: "store", required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    products: [{ type: Schema.Types.ObjectId, ref: "product", required: true }],
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model<IMeeting>("Meeting", MeetingSchema);
export default Meeting;
