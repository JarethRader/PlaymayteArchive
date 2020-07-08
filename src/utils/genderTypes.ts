export enum genderTypes {
  male = 'MALE',
  female = 'FEMALE',
  agender = 'AGENDER',
  angrogyne = 'ANDROGYNE',
  androgynous = 'ANDROGYNOUS',
  femaleToMale = 'FEMALE_TO_MALE',
  genderFluid = 'GENDER_FLUID',
  genderNonconforming = 'GENDER_NONCONFORMING',
  genderQuestioning = 'GENDER_QUESTIONING',
  genderVarient = 'GENDER_VARIENT',
  genderQueer = 'GENDER_QUEER',
  maleToFemale = 'MALE_TO_FEMALE',
  neutrois = 'NEUTROIS',
  nonBinary = 'NON_BINARY',
  pangender = 'PANGENDER',
  trans = 'TRANS',
  transPerson = 'TRANSGENDER_PERSON',
  transMale = 'TRANSGENDER_MALE',
  transFemale = 'TRANSGENDER_FEMALE',
  bigender = 'BIGENDER',
  other = 'OTHER',
  forgo = 'NOT_CHOSEN',
}

export const getGender = (genderSelection: string): genderTypes => {
  switch (genderSelection) {
    case 'AGENDER':
      return genderTypes.agender;
    case 'ANDROGYNE':
      return genderTypes.angrogyne;
    case 'ANDROGYNOUS':
      return genderTypes.androgynous;
    case 'FEMALE_TO_MALE':
      return genderTypes.femaleToMale;
    case 'GENDER_FLUID':
      return genderTypes.genderFluid;
    case 'GENDER_NONCONFORMING':
      return genderTypes.genderNonconforming;
    case 'GENDER_QUESTIONING':
      return genderTypes.genderQuestioning;
    case 'GENDER_VARIENT':
      return genderTypes.genderVarient;
    case 'GENDER_QUEER':
      return genderTypes.genderQueer;
    case 'MALE_TO_FEMALE':
      return genderTypes.maleToFemale;
    case 'NEUTROIS':
      return genderTypes.neutrois;
    case 'NON_BINARY':
      return genderTypes.nonBinary;
    case 'PANGENDER':
      return genderTypes.pangender;
    case 'TRANS':
      return genderTypes.trans;
    case 'TRANSGENDER_PERSON':
      return genderTypes.transPerson;
    case 'MALE':
      return genderTypes.male;
    case 'FEMALE':
      return genderTypes.female;
    case 'TRANSGENDER_MALE':
      return genderTypes.transMale;
    case 'TRANSGENDER_FEMALE':
      return genderTypes.transFemale;
    case 'OTHER':
      return genderTypes.other;
    default:
      return genderTypes.forgo;
  }
};

export default genderTypes;
