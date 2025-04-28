import { Model, Schema, model } from "mongoose";

const courierPartnerSchema = new Schema({
  preference: {
    type: String,
    default: "recommended",
    enum: ["recommended", "custom"],
  },
  courierPartner: {
    type: String,
    required: true,
  },
  reverseShippingCharge: {
    type: Number,
    default:0
  },
  avgReturnTimeDays: {
    type: Number,
    default:0
  },
  claimsRaised: {
    type: Number,
    default: 0,
  },
  courierPartnerClaimApprovalPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const CourierPartner:Model<any> = model("CourierPartner", courierPartnerSchema);

export default CourierPartner;
