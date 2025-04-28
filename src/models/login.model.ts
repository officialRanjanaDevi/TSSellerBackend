import mongoose, { Document, Schema } from "mongoose";

export interface ILogin extends Document {
  email: string;
  password: string;
  userType: string;
}

const loginSchema = new Schema<ILogin>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true }
});

const Login = mongoose.model<ILogin>("Login", loginSchema);

export default Login;
