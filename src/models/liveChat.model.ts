import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  sender: string;
  content: string;
  timestamp: Date;
}

interface ILiveChat extends Document {
  storeId: string;
  userId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    sender: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LiveChatSchema: Schema = new Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

const LiveChat = mongoose.model<ILiveChat>("LiveChat", LiveChatSchema);

export default LiveChat;
