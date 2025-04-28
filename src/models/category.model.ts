import { Model, model, Schema, Document } from "mongoose";

export enum CategoryStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

interface IAttribute {
  name: string;
  type: string;
  options?: string[];
}

export interface ICategory extends Document {
  name: string;
  description: string;
  parent?: ICategory | null;
  image: {
    filename?: string;
    url?: string;
  };
  discount:number;
  featured: boolean;
  status: CategoryStatus;
  attributes: IAttribute[];
  children?: ICategory[]; // To hold children categories
}

const AttributeSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'select', 'text', etc.
  options: [String],
});

const categorySchema: Schema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: {
      filename: { type: String, required: false },
      url: { type: String, required: false },
    },
    discount:{
       type:Number,
       default:10

    },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: CategoryStatus,
      default: CategoryStatus.ACTIVE,
    },
    attributes: { type: [AttributeSchema], default: [] },
  },
  { toJSON: { virtuals: true } }
);

categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

const Category: Model<ICategory> = model<ICategory>("Category", categorySchema);
export default Category;
