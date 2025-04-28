import { Model, Schema, model } from "mongoose";
import Product from "./product.model";
import User from "./user.model";
// import Seller from "./seller.model";
import SellerSchema from "./registerSeller.model";
import { orderSchema } from "./order.model";
import Order from "./order.model";
const statusUpdateSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["placed", "packed", "dispatched", "out for delivery", "delivered", "return", "refund", "cancelled"],
      required: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);
const subOrderSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  returnLastDate: {
    type: Date,
    required: false,
  },
  mrp: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "orders",
    // ref:Order,
    required: true,
  },
  // dispatchdate:{
  //   type:Date,
  //   default:Date.no
  // }
  storeId: {
    type: Schema.Types.ObjectId,
    ref: SellerSchema,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending",
  },
  delivery_status:{
    type:String,
    enum:['In Transit','Out for Delivery','Out for take away','Delivered','Lost']
  },
  statusUpdates: [statusUpdateSchema],
  delivery_partner:{
    type:String
  },
  delivery_price:{
    type:Number
  },
  total_after_delivery:{
    type:Number
  }
});

const SubOrder: Model<any> = model<any>("SubOrder", subOrderSchema);
export default SubOrder;
