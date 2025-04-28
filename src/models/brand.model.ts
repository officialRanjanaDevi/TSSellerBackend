import { Model, model, Schema } from "mongoose";
// import Category from "./category.model";
// import OfferModel from "./offer.model";

const brandSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  logo: {
    filename: { type: String, required: false },
    url: { type: String, required: false }
  },
  video: {
    filename: { type: String, required: false },
    url: { type: String, required: false }
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: "category"
  }],
  isPopular: { type: Boolean, default: false },
  totalProductsSold: {
    type: Number,
    default: 0
  },
  products: [{
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "products"
  }],

  offer: {
    type: Schema.Types.ObjectId,
    ref: "Offer"
  }

});

const Brand: Model<any> = model<any>("brand", brandSchema);
export default Brand;
