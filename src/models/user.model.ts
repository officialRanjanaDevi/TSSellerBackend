import { Model, model, Schema } from "mongoose";
import Product from "./product.model";
import Seller from "./seller.model";

export enum userStatus {
  active = "active",
  inactive = "inactive",
}

export enum gender {
  male = "male",
  female = "female",
  other = "other",
}

export const userDetails = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: Seller, required: false },
  phone_number: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: false, enum: Object.values(gender) },
  profilePic: {
    filename: { type: String, required: false },
    url: { type: String, required: false },
  },
  country: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    reqired: false,
  },

  dateOfBirth: { type: String, required: false },
  role: { type: String, default: "customer" },
  access_level: { type: Number, default: 1 },
  password: { type: String, default: "00000000", required: true },
  status: {
    type: String,
    enum: Object.values(userStatus),
    default: userStatus.active,
  },
  language: [{ type: String, required: false }],
  paymentDetails: {
    bankName: { type: String, required: false },
    bankAddress: { type: String, required: false },
    accountNumber: { type: String, required: false },
    ifscCode: { type: String, required: false },
    custId: { type: String, required: false },
  },

  wishList: [{ type: Schema.Types.ObjectId, ref: Product }],
  thirdParty: { type: Boolean, default: false },
});

const User: Model<any> = model<any>("user", userDetails);
export default User;
