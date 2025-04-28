import { Model, model, Schema } from "mongoose";
import Seller from "./seller.model";
import Store from "./store.model";
import User from "./user.model";
export const reelSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: Seller,
        required: true,
    },
    storeId:{
        type: Schema.Types.ObjectId,
        ref: Store,
        required: true,
    },
    video:{
        type:String,
        required: true,
    },
    caption:{
        type:String,
        required: true,
    },
    likes:[{
        userId:{
            type:Schema.Types.ObjectId,
            ref:User
        }
    }],
    dislikes:[{
        userId:{
            type:Schema.Types.ObjectId,
            ref:User
        }
    }],
    comments:[{
        userId:{
            type:Schema.Types.ObjectId,
            ref:User
        },
        comment:{
            type:String,  
            required:true
        }       
    }
    ],
    shares:{
        type:Number,
        required: true,
        default:0,
    },
    type:{
        type: String,
        required: true,
        default:"store"
    }
});

const Reel: Model<any> = model<any>("reel", reelSchema);
export default Reel;
