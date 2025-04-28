import { Model, model, Schema } from "mongoose";
export const bannerSchema = new Schema({
    url:{
        type:String,
        required: true,
    },
    category:{
        type:String,
        required: true,
        unique:true
    }, 
});

const Banner: Model<any> = model<any>("banner", bannerSchema);
export default Banner;
