import { Model, model, Schema } from "mongoose";

const arrivalSchema = new Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  productName: { type: String, required: true }
});

const Arrival: Model<any> = model<any>("arrival", arrivalSchema);
export default Arrival;
