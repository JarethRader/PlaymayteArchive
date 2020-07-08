import { Document, Schema, Model, model } from 'mongoose';
import User from './User';
const uuidv4 = require('uuid').v4;

export interface IMessage {
  sender: string; // username
  message: string;
  timestamp: string;
}

export type MessageType = IMessage;

export interface IChat {
  room: {
    roomID: string;
    userI: {
      _ID: string;
      handle: string;
    };
    userII: {
      _ID: string;
      handle: string;
    };
  };
  history: IMessage[];
}

export interface IChatModel extends IChat, Document {
  getRoom(): string;
}

export const ChatSchema: Schema = new Schema({
  room: {
    roomID: {
      type: String,
      default: uuidv4(),
    },
    userI: {
      _ID: {
        type: String,
        required: true,
      },
      handle: {
        type: String,
        required: true,
      },
    },
    userII: {
      _ID: {
        type: String,
        required: true,
      },
      handle: {
        type: String,
        required: true,
      },
    },
  },
  history: {
    type: [
      {
        message: String,
        timestamp: String,
        sender: String,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

ChatSchema.methods.getRoom = async function (): Promise<string> {
  const userI = await User.findById(this.room.userI._ID);
  const userII = await User.findById(this.room.userII._ID);

  return `${userI?.info.firstName}-${userII?.info.firstName}`;
};

export const Chat: Model<IChatModel> = model<IChatModel>('Chat', ChatSchema);

export default Chat;
