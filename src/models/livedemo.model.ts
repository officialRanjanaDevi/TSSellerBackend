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

export const liveDemoDetails = new Schema({
    customerId: { type: String, required: true, unique: true },
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: Product,
                required: false,
                unique: true
            }
        },
    ],
    document: [{
        name: { type: String, required: false },
        url: { type: String, required: false }
    }]
});

const LiveDemo: Model<any> = model<any>("liveDemo", liveDemoDetails);
export default LiveDemo;