import { Document, Schema, Model, model } from 'mongoose';

/**
 * @desc custom type definitions from ./utils
 */
import genderTypes, { getGender } from '../utils/genderTypes';
import preferredPronouns, { getPreferredPronouns } from '../utils/pronounTypes';
import orientationTypes, { getOrientation } from '../utils/orientationTypes';

export interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  dob: string;
  gamerTag?: string;
  gender?: genderTypes;
  preferredPronoun?: preferredPronouns;
  orientation?: orientationTypes;
  verified?: boolean;
}

export interface IGames {
  currentlyPlaying?: string[];
  favoriteGames?: string[];
  beteNoireGames?: string[];
  other?: string[];
}

export interface IAnimes {
  currentlyWatching?: string[];
  finishedAnimes?: string[];
  favoriteAnimes?: string[];
  beteNoireAnimes?: string[];
  other?: string[];
}

export interface IUser {
  info: IUserInfo;
  aboutMe?: string;
  games?: IGames;
  animes?: IAnimes;
}

export interface IUserModel extends IUser, Document {
  concatName(): string;
}

export const UserSchema: Schema = new Schema({
  info: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gamerTag: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: genderTypes,
      default: getGender('NOT_CHOSEN'),
    },
    preferredPronoun: {
      type: preferredPronouns,
      default: getPreferredPronouns('NOT_CHOSEN'),
    },
    orientation: {
      type: orientationTypes,
      default: getOrientation('NOT_CHOSEN'),
    },
    dob: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  aboutMe: {
    type: String,
    default: '',
    trim: true,
  },
  games: {
    currentlyPlaying: {
      type: [String],
      default: [],
    },
    favoriteGames: {
      type: [String],
      default: [],
    },
    beteNoireGames: {
      type: [String],
      default: [],
    },
    other: {
      type: [String],
      default: [],
    },
  },
  animes: {
    currentlyWatching: {
      type: [String],
      default: [],
    },
    finishedAnimes: {
      type: [String],
      default: [],
    },
    favoriteAnimes: {
      type: [String],
      default: [],
    },
    beteNoireAnimes: {
      type: [String],
      default: [],
    },
    other: {
      type: [String],
      default: [],
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

UserSchema.pre('save', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

UserSchema.methods.concatName = function (): string {
  return this.first + ' ' + this.last;
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);

export default User;
