import { model, Schema } from "mongoose";
import SellerSchema from "./registerSeller.model";

const ticket_schema = new Schema({
  Issue_regarding: { type: String },
  seller_name: { type: String },
  seller_id: { type: Schema.Types.ObjectId, ref: "Seller" },
  store_id: { type: Schema.Types.ObjectId },
  problem_statement: { type: String },
  phoneNumber: { type: Number },
//   Images: [
//     { url: { type: String } }
//   ],
Images: [{ type: String }],
  resolved: { type: Boolean, default: false },
  status:{type:String,default:''},
  ResponseFromAdmin: { type: String , default:'' }
}, { timestamps: true });

const Ticket = model("Ticket", ticket_schema);
export default Ticket;