import { Model, model, Schema, Document } from "mongoose";
import Product from "./product.model";

export enum CommissionStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface IProductCommission extends Document {
  productId: Object;
  commission: number;
  datedFrom: Date;
  datedTo: Date;
  status: CommissionStatus;
}

const productCommissionSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
  commission: { type: Number, required: false },
  datedFrom: { type: Date, required: false },
  datedTo: { type: Date, required: false },
  status: {
    type: String,
    required: false,
    enum: Object.values(CommissionStatus),
    default: CommissionStatus.ACTIVE,
  },
});

const ProductCommission: Model<IProductCommission> = model<IProductCommission>(
  "productCommission",
  productCommissionSchema
);
export default ProductCommission;
