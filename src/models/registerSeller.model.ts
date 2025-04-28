import mongoose, { Document, Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
import Store from "./store.model";

export interface SellerRegister extends Document {
  email: string;
  password: string;
  role: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): any;
  getJWTToken(): string;
  seller?: any;
  storeId?: any;
  isBlocked?: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: number;
  alternatePhoneNumber: number;
  access_level: string;
  profilePic: any;
  status: string;
  language: string;
  documentVerification: DocumentVerification;
  addressLine: string;
  city: string;
  pincode: number;
  landmark: string;
  state: string;
  country: string;
  avatar: any;
  restPasswordToken: string;
  resetPasswordExpired: Date;
  uniqueVisitors:Number;
  totalVisitors:Number;
  qrCode:String;
  // validate:Number;
}

export interface DocumentVerification extends Document {
  status: sellerStatus;
  documents: Array<{
    name: string;
    url: string;
  }>;
  aadharNumber?: string;
  panNumber?: string;
  gstin?: string;
  ifscCode?: string;
  accountNumber?: string;
}

export enum sellerStatus {
  active = "active",
  inactive = "inactive",
  pending = "pending",
}

export enum level {
  one = "1",
  two = "2",
  three = "3",
}

const sellerSchema = new Schema<SellerRegister>(
  {
    email: {
      type: String,
      required: [false, "Please Enter Your Email 🫡"],
      unique: false,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [false, "Please Enter Your Password 🙈"],
      minLength: [8, "Password should be greater than 8 characters."],
    },
    role: {
      type: String,
      default: "seller",
    },
    storeId: { type: Schema.Types.ObjectId, ref: Store, required: false },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    firstName: { type: String, required: false },
    middleName: { type: String },
    lastName: { type: String, required: false },
    phoneNumber: { type: Number, required: false },
    alternatePhoneNumber: { type: Number },
    addressLine: { type: String, required: false },
    city: { type: String, required: false },
    pincode: { type: Number, required: false },
    landmark: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false, default: "India" },
    //----------------
    uniqueVisitors:{
      type:Number,
      default:0
    },
  
    totalVisitors:{
      type:Number,
      default:0
    }//---------------
    ,
    access_level: {
      type: String,
      required: false,
      enum: Object.values(level),
      default: level.one,
    },
    avatar: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },

    // validate:{
    //   type:Number , default:0
    // },

    qrCode:{
      type:String
    },
    
    status: {
      type: String,
      enum: Object.values(sellerStatus),
      default: sellerStatus.active,
    },
    //----------------
    //---------------
    language: [{ type: String, required: false }],
    documentVerification: {
      status: {
        type: String,
        enum: Object.values(sellerStatus),
        default: sellerStatus.inactive,
      },
      documents: [
        {
          name: { type: String, required: false },
          url: { type: String, required: false },
        },
      ],
      aadharNumber: { type: String, required: false },
      panNumber: { type: String, required: false },
      gstin: { type: String, required: false },
      ifscCode: { type: String, required: false },
      accountNumber: { type: String, required: false },
    },
    restPasswordToken: String,
    resetPasswordExpired: Date,
  },
  { timestamps: true }
);

sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

sellerSchema.methods.getJWTToken = function () {
  return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

sellerSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Generate ResetPassword Token
sellerSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to userSchema
  this.restPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpired = Date.now() + 15 * 60 * 1000;

  return resetToken;
};


sellerSchema.methods.validateDocuments = function () {
  this.documentVerification.status = sellerStatus.active;
  return this.save();
};


sellerSchema.methods.deleteDocuments = function () {
  this.documentVerification = undefined;
  return this.save();
};


const SellerSchema = mongoose.model<SellerRegister>(
  "SellerSchema",
  sellerSchema
);

export default SellerSchema;
