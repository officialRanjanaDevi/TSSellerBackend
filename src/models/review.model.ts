import { Model, model, Schema, ObjectId } from "mongoose";
import { Document } from "mongoose";
import User from "./user.model";
import Product from "./product.model";

export interface IReview extends Document {
  productId: ObjectId;
  userId: ObjectId;
  reviewText: string;
  pictures: {
    filename: string;
    url: string;
  }[];
  likes: ObjectId[];
  dislikes: ObjectId[];
  rating: number;
  status: "active" | "inactive";
}

const reviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, ref: User, required: true,  unique: true },
  productId: { type: Schema.Types.ObjectId, ref: Product, required: true },
  reviewText: { type: String, required: true },
  pictures: [
    {
      filename: { type: String, required: false },
      url: { type: String, required: false }
    }
  ],
  likes: [{ type: Schema.Types.ObjectId, ref: User }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: User }],
  rating: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
});

const Review: Model<IReview> = model<IReview>("Review", reviewSchema);
export default Review;
