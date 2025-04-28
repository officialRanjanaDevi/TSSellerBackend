import { Schema, model, Document } from 'mongoose';

interface ISponsoredProduct extends Document {
    productId: string;
    categoryId: string;
    subcategoryId: string;
}

const sponsoredProductSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true }
});

const SponsoredProduct = model<ISponsoredProduct>('SponsoredProduct', sponsoredProductSchema);

export default SponsoredProduct;
