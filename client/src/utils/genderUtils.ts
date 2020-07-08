export const genderOptions = [
  'prefer not to say',
  'male',
  'female',
  'agender',
  'angrogyne',
  'androgynous',
  'female to male',
  'gender fluid',
  'gender nonconforming',
  'gender questioning',
  'gender varient',
  'gender queer',
  'male to female',
  'neutrois',
  'non-binary',
  'pangender',
  'trans',
  'trans person',
  'trans male',
  'trans female',
  'bigender',
  'other',
];

export enum genderTypes {
  forgo = 'NOT_CHOSEN',
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
}

export const getGender = (genderSelection: string): genderTypes => {
  switch (genderSelection) {
    case 'agender':
      return genderTypes.agender;
    case 'angrogyne':
      return genderTypes.angrogyne;
    case 'androgynous':
      return genderTypes.androgynous;
    case 'female to male':
      return genderTypes.femaleToMale;
    case 'gender fluid':
      return genderTypes.genderFluid;
    case 'gender nonconforming':
      return genderTypes.genderNonconforming;
    case 'Gender questioning':
      return genderTypes.genderQuestioning;
    case 'gender varient':
      return genderTypes.genderVarient;
    case 'gender queer':
      return genderTypes.genderQueer;
    case 'male to female':
      return genderTypes.maleToFemale;
    case 'neutrois':
      return genderTypes.neutrois;
    case 'non-binary':
      return genderTypes.nonBinary;
    case 'pangender':
      return genderTypes.pangender;
    case 'trans':
      return genderTypes.trans;
    case 'trans person':
      return genderTypes.transPerson;
    case 'male':
      return genderTypes.male;
    case 'female':
      return genderTypes.female;
    case 'trans male':
      return genderTypes.transMale;
    case 'trans female':
      return genderTypes.transFemale;
    case 'bigender':
      return genderTypes.bigender;
    case 'other':
      return genderTypes.other;
    default:
      return genderTypes.forgo;
  }
};

export default genderTypes;
