import { Model, model, Schema } from "mongoose";
import Seller from "./seller.model";
import Store from "./store.model";

export interface Offer {
  sellerId: Object;
  title: string;
  description: string;
  discount: number;
  applicableProducts: Array<Schema.Types.ObjectId>; // Array of product IDs on which the offer will be applicable
  createdAt: Date;
  updatedAt: Date;
  validFrom: Date;
  validUntil: Date;
  storeId: Object;
}

const offerSchema: Schema<Offer> = new Schema<Offer>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: Seller, required: false },
    storeId: { type: Schema.Types.ObjectId, ref: Store, required: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: Number, required: true },
    applicableProducts: [
      { type: Schema.Types.ObjectId, ref: "product", required: false },
    ],
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
  },
  { timestamps: true }
);

const OfferModel: Model<Offer> = model<Offer>("Offer", offerSchema);

export default OfferModel;
