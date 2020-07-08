import { Document, Schema, Model, model } from 'mongoose';

export class ProspectType {
  public prospectID: string = '';
  public decided: boolean = false;
}

export interface IProspects {
  userID: string;
  prospects: ProspectType[];
}

export interface IProspectModel extends IProspects, Document {
  addNewProspect(prospectID: string): void;
  removeProspect(prospectID: string): void;
}

export const ProspectSchema: Schema = new Schema({
  userID: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  prospects: {
    type: [
      {
        prospectID: String,
        decided: Boolean,
      },
    ],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

ProspectSchema.pre('save', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ProspectSchema.methods.addNewProspect = async function (
  addID: string
): Promise<void> {
  // check is user is already added in the list
  const checkProspect = {
    prospectID: addID,
    decided: false,
  };
  const exists = this.prospects.find(
    (prospect: ProspectType) => prospect.prospectID === addID
  );
  if (exists === undefined) {
    this.set({ prospects: [...this.prospects, checkProspect] });
    this.save();
  }
  return;
};

ProspectSchema.methods.removeProspect = async function (
  removeID: string
): Promise<void> {
  this.set({
    prospects: this.prospects.filter(
      (prospect: ProspectType) => prospect.prospectID !== removeID
    ),
  });
  this.save();
  return;
};

export const Prospect: Model<IProspectModel> = model<IProspectModel>(
  'Prospect',
  ProspectSchema
);

export default Prospect;
