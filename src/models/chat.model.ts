import { Schema, model, Document } from "mongoose";

export interface IChat extends Document {
  // participants: string[];
  messages: IMessage[];
}

export interface IMessage {
  sender: string;
  content: string;
  timestamp: Date;
  subject?: string;
  attachment?: string;
  file?: string;
  description?: string;
}

const chatSchema = new Schema<IChat>({
  // participants: [String],
  messages: [
    {
      sender: String,
      content: String,
      timestamp: Date,
      subject: String,
      attachment: String,
      file: String,
      description: String
    }
  ]
});

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
