import { Model, model, Schema, Document } from "mongoose";

export enum PaymentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export interface IPayment extends Document {
  storeId: string;
  totalItems: number;
  balance: number;
  totalRevenue: number;
  status: PaymentStatus;
  sellerId:Schema.Types.ObjectId
}

const paymentSchema: Schema = new Schema({
  storeId: { type: String, required: true },
  totalItems: { type: Number, required: true },
  balance: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.ACTIVE
  },
  sellerId:{type:Schema.Types.ObjectId}
});

const PaymentModel: Model<IPayment> = model<IPayment>("Payment", paymentSchema);
export default PaymentModel;
