import { Document, Schema, Model, model } from 'mongoose';

interface IMatch {
  UserIMatched: {
    userID: string;
    matched: boolean;
    unmatched: boolean;
  };
  UserIIMatched: {
    userID: string;
    matched: boolean;
    unmatched: boolean;
  };
}

export interface IMatchModel extends IMatch, Document {}

export const MatchSchema: Schema = new Schema({
  UserIMatched: {
    userID: {
      type: String,
      required: true,
    },
    matched: {
      type: Boolean,
      default: false,
    },
    unmatched: {
      type: Boolean,
      default: false,
    },
  },
  UserIIMatched: {
    userID: {
      type: String,
      required: true,
    },
    matched: {
      type: Boolean,
      default: false,
    },
    unmatched: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

MatchSchema.pre('save', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const Match: Model<IMatchModel> = model<IMatchModel>(
  'Match',
  MatchSchema
);

export default Match;
