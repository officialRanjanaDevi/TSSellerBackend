import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the document
export interface LoginAuthDocument extends Document {
  mobileNumber: string;
  otp?: string;
  otpExpiration?: Date;
}

// Define the Mongoose schema for the login authentication model
const loginAuthSchema = new Schema<LoginAuthDocument>({
  mobileNumber: { type: String, required: true },
  otp: { type: String },
  otpExpiration: { type: Date },
});

// Create and export the model
const LoginAuth = mongoose.model<LoginAuthDocument>('LoginAuth', loginAuthSchema);

export default LoginAuth;




// import { Model, model, Schema } from "mongoose";

// export const loginAuthDetails = new Schema({
//   mobileNumber: { type: String, required: true, unique: true },
//   otp: { type: String },
//   otpExpiration: { type: Date }
// });

// const loginAuth: Model<any> = model<any>("loginAuth", loginAuthDetails);
// export default loginAuth;