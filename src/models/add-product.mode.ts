import mongoose, { Schema, Document, model } from 'mongoose';

export interface addProduct extends Document {
    productName: string;
    shortDescription: string;
    fullDescription: string;
    manufacturerDrop: string;
    brand: string;
    IsNumber: string;
    CMLNumber: string;
    gstNumber: string;
    sgstNumber: string;
    countryOfOrigin: string;
    Color: string;
    status: string;
    type: string;
    material: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
    Weight: number;
    tags: string[];
    sku: string;
    HSNCode: string;
    Images: string[];
    Size: string[];
    showonhome: boolean;
    marknew: boolean;
    reviewallow: boolean;
}

const productSchema = new Schema<addProduct>({
    productName: { type: String, required: true },
    shortDescription: { type: String },
    fullDescription: { type: String },
    manufacturerDrop: { type: String },
    brand: { type: String },
    IsNumber: { type: String },
    CMLNumber: { type: String },
    gstNumber: { type: String },
    sgstNumber: { type: String },
    countryOfOrigin: { type: String },
    Color: { type: String },
    status: { type: String },
    type: { type: String },
    material: { type: String },
    quantity: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    Weight: { type: Number },
    tags: { type: [String] },
    sku: { type: String },
    HSNCode: { type: String },
    Images: { type: [String] },
    Size: { type: [String] },
    showonhome: { type: Boolean, default: false },
    marknew: { type: Boolean, default: false },
    reviewallow: { type: Boolean, default: false }
});

export default model<addProduct>('product1', productSchema);
