import { Model, Schema, model } from "mongoose";

export interface ISubcategory extends Document{
  name: string;
  description: string;
  category: Schema.Types.ObjectId;
}

const subcategorySchema: Schema = new Schema<ISubcategory>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }
});

const SubCategory: Model<ISubcategory> = model<ISubcategory>("SubCategory", subcategorySchema);
export default SubCategory;

