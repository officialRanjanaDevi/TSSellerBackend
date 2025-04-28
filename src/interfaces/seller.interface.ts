import { string } from "joi";

export interface IUser extends Document {
  id: any;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
