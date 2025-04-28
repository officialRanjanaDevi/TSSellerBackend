import { Schema, model, Document } from "mongoose";

export interface IContactUs extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  message: string;
  attachment: string;
  createdAt: Date;
}

const contactUsSchema = new Schema<IContactUs>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  message: { type: String, required: true },
  attachment: [ { type: String, required: false } ],
  createdAt: { type: Date, default: Date.now }
});

const ContactUs = model<IContactUs>("ContactUs", contactUsSchema);

export default ContactUs;
