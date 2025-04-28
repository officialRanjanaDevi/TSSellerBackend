import { Model, model, Schema, ObjectId } from 'mongoose';
import { Document } from 'mongoose';
import User from './user.model';
import Store from './store.model'

export interface IStoreReview extends Document {
  storeId: ObjectId;
  userId: ObjectId;
  reviewText: string;
  rating: number;
  status: 'active' | 'inactive';
}

const storeReviewSchema = new Schema<IStoreReview>({
  userId: { type: Schema.Types.ObjectId, ref: User, required: true , unique: true},
  storeId: { type: Schema.Types.ObjectId, ref: Store, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

const StoreReview: Model<IStoreReview> = model<IStoreReview>('StoreReview', storeReviewSchema);
export default StoreReview;
