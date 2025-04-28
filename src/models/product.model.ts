import { Model, model, Schema } from "mongoose";
import Store from "./store.model";

import Brand from "./brand.model";
import Category from "./category.model";
import Seller from "./seller.model";
import SubCategory from "./category-sub.model";
import SellerSchema from "./registerSeller.model";

export enum productStatus {
  active = "active",
  inactive = "inactive",
}

const variantSchema = new Schema({
  // variantId: { type: String, required: true, unique: true },
  color: { type: String, required: false },
  size: { type: String, required: false },
  stock: { type: Number, required: false, default: 1 },
  price: { type: Number, required: false, min: 0 },
  discount: { type: Number, required: false, default: 0 },
  // images: [
  //   {
  //     public_id: {
  //       type: String,
  //       required: true,
  //     },
  //     url: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  sku: { type: String, required: false },
});
const SizeDetailsSchema = new Schema({
  trialshopyPrice: { type: Number },
  defectivePrice: { type: Number },
  inventory: { type: Number },
  skuId: { type: Number },
  Price: { type: Number },
  MRP: { type: Number },
  Inventory: { type: Number },
  SkuId: { type: String }
});
export const productDetails = new Schema({
  // productId: { type: String, required: true, unique: true },

  sellerId: { type: Schema.Types.ObjectId, ref: SellerSchema, required: false },//changed here
  storeId:{type:Schema.Types.ObjectId},
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: Category,
      required: true,
    },
  ],

  // brandId: {
  //   type: Schema.Types.ObjectId,
  //   ref: Brand,
  //   required: false,
  // },

  // sellerId: { type: Schema.Types.ObjectId, ref: Seller, required: true },

  productName: { type: String, required: false },//true
  productImage:{type:String ,required:false},
  shortDescription: { type: String, required: false },//true
  fullDescription: { type: String, required: false },
  // categories:{type:String, required:false},
  // status: {
  //   type: String,
  //   required: true,
  //   enum: Object.values(productStatus),
  //   default: productStatus.active,
  // },
  // tags: [{ type: String, required: false }],
  // manufacturer: { type: String, required: false },
  //added here ------------------------------------->
  manufacturerDrop: { type: String, required: false },
  brand: { type: String },
  gstNumber: { type: String },
  sgstNumber: { type: String },
  countryOfOrigin: { type: String },
  Color: { type: String },
  status: { type: String, default:'active' },
  type: { type: String },
  material: { type: String },
  quantity: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  Weight: { type: Number },
  tags: { type: [String] },
  HSNCode: { type: String },
  Images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  related_product:[
    {type:Schema.Types.ObjectId,default:'',ref:'product'}
  ],
  Size: { 
    type: Map, 
    of: SizeDetailsSchema
},
  //=================================================>
  sku: { type: String, required: false },
  showonhome: { type: Boolean, default: false },
  marknew: { type: Boolean, default: false },
  reviewallow: { type: Boolean, default: false },
  IsNumber: { type: String },
  CMLNumber: { type: String },

  // pricing and shipping
  // pricing
  price: { type: Number, required: false, min: 0 },
  mrp: { type: Number, required: false, min: 0 },
  isDiscount: { type: Boolean, required: false, default: true },
  discount: { type: Number, required: false, default: 0 },
  category:{type:Schema.Types.ObjectId, ref:'Category'},
  // shipping
  // shippingType: { type: String, enum: ["Free Shipping", "Returnable"] },
  // shippingCharges: { type: Number, required: false, min: 0, default: 0 },

  manufactureDate: {
    type: Date,
  },
  expireDate: {
    type: Date,
  },

  inStock: { type: Boolean, default: false },
  stock: { type: Number, required: false, default: 1 },
  orderMinQuantity: { type: Number, required: false, default: 1 },
  orderMaxQuantity: { type: Number, required: false },
  forRent:{type:Boolean, default:false},
  rentPerHour:{type:Number,default:0},
  features: [{ type: String, required: false }],

  // attribute depends on product type, will define new model- ProductType
  // attributes: [
  //   {
  //     name: { type: String, required: false },
  //     value: { type: String, required: false },
  //   },
  // ],
  attributes: {
    type: Map,
    of: String,
    default: {}
  },
  // colors: [{ type: String, required: false }],

  // sizes for clothes of S, M, L, XL, XXL

  specifications: [
    {
      title: { type: String, required: false },
      value: { type: String, required: false },
    },
  ],

  // not required
  weight: { type: String, required: false },
  height: { type: String, required: false },
  length: { type: String, required: false },
  width: { type: String, required: false },
  dimensions: { type: String, required: false },
  publisher: { type: String, required: false },
  language: { type: String, required: false },

  // *managed by trialshopy business logic

  //* manage by developer
  //seo
  metaTitle: { type: String, required: false },
  metaKeywords: [{ type: String, required: false }],
  metaDescription: { type: String, required: false },

  //rating
  rating: {
    count: { type: Number, required: false },
    rating: { type: String, required: false },
  },
  isNewWeekly: {
    type: Boolean,
    default: false,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  variants: [variantSchema],
});

productDetails.index({ productName: "text", shortDescription: "text" });

const Product: Model<any> = model<any>("product", productDetails);
export default Product;
