import { Model, model, Schema, Document } from "mongoose";

export interface IDomain extends Document {
   couponType:String,
   domain:String,
   discount:Number,
   status:String
}

const domainSchema: Schema = new Schema({
    couponType:{
        enum:["itsector","college","school"],
        type:String,
        required:true
    },
    domain:{
        type:String,
    },
    discount:{
        type:Number,
        required:true
    },
    status:{
        enum:["active","inactive"],
        type:String,
        default:"active"
    }

});

const Domain: Model<IDomain> = model<IDomain>("Domain", domainSchema);

export default Domain;
