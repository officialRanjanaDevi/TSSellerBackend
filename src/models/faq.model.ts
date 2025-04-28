import {Schema, model, Document} from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  createdAt: Date;
}

const faqSchema = new Schema<IFaq>({
  question: {type: String, required: true},
  answer: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

const Faq = model<IFaq>('Faq', faqSchema);

export default Faq;