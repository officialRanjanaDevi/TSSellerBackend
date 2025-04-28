import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationDocument extends Document {
  userId: Schema.Types.ObjectId | string;
  title: string;
  message: string;
  broadcast?:Boolean;
  url?: string; // Make URL optional
  createdAt?: Date;
  updatedAt?: Date;
  
}

const notificationSchema = new Schema<NotificationDocument>({
  userId: { type: Schema.Types.Mixed, required: false},
  title: { type: String, required: false },
  message: { type: String, required: false },
  url: { type: String, required: false }, // Add URL field
  broadcast:{type:Boolean,default:false}
}, { timestamps: true });

const Notification = mongoose.model<NotificationDocument>('Notification', notificationSchema);

export default Notification;
