import mongoose, { Document, Schema } from "mongoose";
import { mailSender } from "../utils/mailSender";

export interface OTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<OTP>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});


const OTP = mongoose.model<OTP>("OTP", otpSchema);

export default OTP;
