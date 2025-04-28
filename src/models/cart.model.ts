import { Model, model, Schema } from "mongoose";
import Product from "./product.model";

export enum level {
    one = '1',
    two = '2',
    three = '3'
};

export enum productCount {
    one = 1, two = 2, three = 3, four = 4, five = 5,
}


export const cartDetails = new Schema({
    // access_level: { type: String, required: true, enum: Object.values(level) },
    // count : {type: Number, required: false, enum: Object.values(productCount), default: ProductCount.One},
    customerId: { type: String, required: true, unique: true },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: Product,
                required: false,
                unique: true
            },
            count: {
                type: Number,
                required: false,
                default: 1,
            },
        },
    ],
    document: [{
        name: { type: String, required: false },
        url: { type: String, required: false }
    }]
});

const Cart: Model<any> = model<any>("cart", cartDetails);
export default Cart;
