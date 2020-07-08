export const orientationsOptions = [
  'prefer not to say',
  'straight',
  'gay',
  'lesbian',
  'bisexual',
  'queer',
  'lgbtq',
  'asexual',
  'allousexual',
  'aromantic',
  'heterosexual',
  'homosexual',
  'androsexual',
  'bicurious',
  'demiromantic',
  'demisexual',
  'gynesexual',
  'polyamorous',
  'skoliosexual',
  'other',
];

export enum orientationTypes {
  prefer_not_to_say = 'NOT_CHOSEN',
  straight = 'STRAIGHT',
  gay = 'GAY',
  lesbian = 'LESBIAN',
  bisexual = 'BISEXUAL',
  queer = 'QUEER',
  lgbtq = 'LGBTQ',
  asexual = 'ASEXUAL',
  allousexual = 'ALLOUSEXUAL',
  aromantic = 'AROMANTIC',
  heterosexual = 'HETEROSEXUAL',
  homosexual = 'HOMOSEXUAL',
  androsexual = 'ANDROSEXUAL',
  bicurious = 'BICURIOUS',
  demiromantic = 'DEMIROMANTIC',
  demisexual = 'DEMISEXUAL',
  gynesexual = 'GYNESEXUAL',
  polyamorous = 'POLYAMOROUS',
  skoliosexual = 'SKOLIOSEXUAL',
}

export const getOrientation = (
  orientationSelected: string
): orientationTypes => {
  switch (orientationSelected) {
    case 'straight':
      return orientationTypes.straight;
    case 'gay':
      return orientationTypes.gay;
    case 'lesbian':
      return orientationTypes.lesbian;
    case 'bisexual':
      return orientationTypes.bisexual;
    case 'queer':
      return orientationTypes.queer;
    case 'lgbtq':
      return orientationTypes.lgbtq;
    case 'asexual':
      return orientationTypes.asexual;
    case 'allousexual':
      return orientationTypes.allousexual;
    case 'aromantic':
      return orientationTypes.aromantic;
    case 'heterosexual':
      return orientationTypes.heterosexual;
    case 'homosexual':
      return orientationTypes.homosexual;
    case 'androsexual':
      return orientationTypes.androsexual;
    case 'bicurious':
      return orientationTypes.bicurious;
    case 'demiromantic':
      return orientationTypes.demiromantic;
    case 'demisexual':
      return orientationTypes.demisexual;
    case 'gynesexual':
      return orientationTypes.gynesexual;
    case 'polyamorous':
      return orientationTypes.polyamorous;
    case 'skoliosexual':
      return orientationTypes.skoliosexual;
    default:
      return orientationTypes.prefer_not_to_say;
  }
};

export default orientationTypes;
