// Import necessary modules
import mongoose, { Model, model, Schema } from "mongoose";
import Seller from "./seller.model";

// Define the interface for the form data
interface VerificationDataModel extends Document {
  sellerId: string;
  aadharNumber: string;
  panNumber: string;
  GstinNumber: string;
  fullName: string;
  accountNumber: string;
  ifscNumber: string;
  aadharUpload: FileModel;
  panUpload: FileModel;
  GstinUpload: FileModel;
  accountUpload: FileModel;
}

// Define the file interface
interface FileModel {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

// Define the schema for the file
const fileSchema: Schema = new Schema({
  fieldname: String,
  originalname: String,
  mimetype: String,
  size: Number,
  destination: String,
  filename: String,
  path: String,
});

// Define the schema for the form data
const verificationSchema: Schema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: Seller, required: true },
    aadharNumber: String,
    panNumber: String,
    GstinNumber: String,
    fullName: String,
    accountNumber: String,
    ifscNumber: String,
    aadharUpload: fileSchema,
    panUpload: fileSchema,
    GstinUpload: fileSchema,
    accountUpload: fileSchema,
  },
  { timestamps: true }
);

// Create the Mongoose model for the form data
const Verification: Model<VerificationDataModel> = model<VerificationDataModel>(
  "verification",
  verificationSchema
);
export default Verification;
