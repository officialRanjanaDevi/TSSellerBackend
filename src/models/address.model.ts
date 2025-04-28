import { Model, model, Schema } from "mongoose";
export enum addressType {
  user = "user",
  seller = "seller",
  store = "store",
}

export enum addressStatus {
  active = "active",
  inactive = "inactive",
}

export const addressDetails = new Schema({
  sellerIds: {
    type: String,
    required: true,
  },
  refId: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(addressType) },
  status: {
    type: String,
    enum: Object.values(addressStatus),
    default: addressStatus.active,
  },
  fullName: { type: String, required: false },
  PhoneNumber: { type: String, required: false },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String, required: false },
  state: { type: String, required: true },
  country: { type: String, required: false, default: "India" },
  lastUsedAt: { type: Date },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
});

addressDetails.index({ location: "2dsphere" });
addressDetails.pre("save", function (next) {
  if (this.isModified()) {
    this.lastUsedAt = new Date();
  }
  next();
});
const Address: Model<any> = model<any>("address", addressDetails);
export default Address;
