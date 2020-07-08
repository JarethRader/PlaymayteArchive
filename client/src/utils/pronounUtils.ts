export const pronounOptions: string[] = [
  'prefer not to say',
  'he/him',
  'she/her',
  'they/them',
  'other',
];

export enum preferredPronouns {
  she = 'SHE_HER',
  he = 'HE_HIM',
  they = 'THEY_THEM',
  other = 'OTHER',
  prefer_not_to_say = 'NOT_CHOSEN',
}

export const getPreferredPronouns = (
  selectedPronoun: string
): preferredPronouns => {
  switch (selectedPronoun) {
    case 'she/her':
      return preferredPronouns.she;
    case 'he/him':
      return preferredPronouns.he;
    case 'they/them':
      return preferredPronouns.they;
    case 'other':
      return preferredPronouns.other;
    default:
      return preferredPronouns.prefer_not_to_say;
  }
};

export default preferredPronouns;
