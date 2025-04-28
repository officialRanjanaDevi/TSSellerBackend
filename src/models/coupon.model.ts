import { Model, model, Schema, Document } from "mongoose";

export enum CouponStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export interface ICoupon extends Document {
  data: string;
  code: string;
  discount: number;
  validFrom: Date;
  validTo: Date;
  status: CouponStatus;
  minimumPurchaseAmount: number;

}

const couponSchema: Schema = new Schema({
  data: { type: String, required: true  },
  code: { type: String, required: true },
  discount: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  status: { type: String, required: true, enum: Object.values(CouponStatus), default: CouponStatus.ACTIVE },
  minimumPurchaseAmount: { type: Number, required: true, default: 0 }
});

const Coupon: Model<ICoupon> = model<ICoupon>("Coupon", couponSchema);

export default Coupon;
