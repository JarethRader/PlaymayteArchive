export enum orientationTypes {
  straight = 'STRAIGHT',
  gay = 'GAY',
  lesbian = 'LESBIAN',
  bisexual = 'BISEXUAL',
  queer = 'QUEER',
  LGBTQ = 'LGBBT',
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
  forgo = 'NOT_CHOSEN',
}

export const getOrientation = (
  orientationSelected: string
): orientationTypes => {
  switch (orientationSelected) {
    case 'STRAIGHT':
      return orientationTypes.straight;
    case 'GAY':
      return orientationTypes.gay;
    case 'LESBIAN':
      return orientationTypes.lesbian;
    case 'BISEXUAL':
      return orientationTypes.bisexual;
    case 'QUEER':
      return orientationTypes.queer;
    case 'LGBBT':
      return orientationTypes.LGBTQ;
    case 'ASEXUAL':
      return orientationTypes.asexual;
    case 'ALLOUSEXUAL':
      return orientationTypes.allousexual;
    case 'AROMANTIC':
      return orientationTypes.aromantic;
    case 'HETEROSEXUAL':
      return orientationTypes.heterosexual;
    case 'HOMOSEXUAL':
      return orientationTypes.homosexual;
    case 'ANDROSEXUAL':
      return orientationTypes.androsexual;
    case 'BICURIOUS':
      return orientationTypes.bicurious;
    case 'DEMIROMANTIC':
      return orientationTypes.demiromantic;
    case 'DEMISEXUAL':
      return orientationTypes.demisexual;
    case 'GYNESEXUAL':
      return orientationTypes.gynesexual;
    case 'POLYAMOROUS':
      return orientationTypes.polyamorous;
    case 'SKOLIOSEXUAL':
      return orientationTypes.skoliosexual;
    case 'NOT_CHOSEN':
      return orientationTypes.forgo;
    default:
      return orientationTypes.forgo;
  }
};

export default orientationTypes;
