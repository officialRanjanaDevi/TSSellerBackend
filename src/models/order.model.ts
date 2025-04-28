// Import Mongoose
import { Model, model, Schema } from "mongoose";
// import user from "./user.model";
import User from "./user.model";
import Seller from "./seller.model";
import SellerSchema from "./registerSeller.model";
import product from "./product.model";
import SubOrder from "./sub_order.model";

// import Seller from "./seller.model";
export const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  //added here seller id to store the seller id 
  // sellerId:{
  //   type:Schema.Types.ObjectId,
  //   ref:Seller,
  //   required:false
  // },

  products: [
    {
      product: {
        type: Schema.Types.ObjectId /*Schema.Types.ObjectId,*/,
        ref: product,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered"],
        default: "pending",
      },
    },
  ],
  coupon:{
    couponType:{
     enum: ["college", "school", "itsector","coupon"],
     type:String,
    },
    email:{
     type:String
    },
    studentId:{
     type:String
    },
    discount:{
     type:Number
    }
},
  payment: [
    {
      transactionId: {
        type: String,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      paymentDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  phone_number: { type: String, required: true },
  shippingAddress: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "India",
    },
    pinCode: {
      type: Number,
      required: true,
    },
  },
  orderDate: {
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
  exchangeReturnWindowClosedOn: {
    type: Date,
    required: false,
  },
  rateProduct: {
    type: Boolean,
    default: false,
  },
  subOrders: [
    {
      type: Schema.Types.ObjectId,
      ref: SubOrder,
      required: true,
    },
  ],
  // delivery_status:{
  //   type:String,
  //   enum:['In Transit','out for delivery','delivered','lost']
  // }
},{timestamps:true});

const Order: Model<any> = model<any>("order", orderSchema);

export default Order;
