import { Document, Schema, Model, model } from 'mongoose';

interface IFriend {
  friendID: string;
  roomID: string; // list of roomIDs the user is a part of
}

export interface IFriendList {
  userID: string;
  FriendList: IFriend[];
}

export interface IFriendListModel extends IFriendList, Document {
  addFriend(friendID: string, roomID: string): void;
  removeFriend(friendID: string): void;
}

export const FriendListSchema: Schema = new Schema({
  userID: {
    type: String,
    required: true,
    trim: true,
  },
  FriendList: {
    type: [
      {
        friendID: String,
        roomID: String,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

FriendListSchema.pre('save', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

FriendListSchema.methods.addFriend = async function (
  friendID: string,
  roomID: string
): Promise<void> {
  const newRoom = {
    friendID,
    roomID,
  };
  this.set({ FriendList: [...this.FriendList, newRoom] });
  this.save();
  return;
};

FriendListSchema.methods.removeFriend = async function (
  friendID: string
): Promise<void> {
  this.set({
    FriendList: this.FriendList.filter(
      (friend: IFriend) => friend.friendID !== friendID
    ),
  });
  this.save();
  return;
};

export const FriendList: Model<IFriendListModel> = model<IFriendListModel>(
  'FriendList',
  FriendListSchema
);

export default FriendList;
