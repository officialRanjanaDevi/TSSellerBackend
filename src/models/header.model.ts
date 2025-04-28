import { Model, model } from "mongoose";
import { Schema } from "mongoose";

interface IHeader extends Document {
    title: string;
    products: string[];
    subcategory: Schema.Types.ObjectId;
}

const headerSchema: Schema = new Schema<IHeader>({
    title: { type: String, required: true },
    products: [{ type: String, required: false }],
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true }
});

const Header: Model<IHeader> = model<IHeader>("Header", headerSchema);
export default Header;