export enum preferredPronouns {
  she_her = 'SHE_HER',
  he_him = 'HE_HIM',
  they_them = 'THEY_THEM',
  other = 'OTHER',
  forgo = 'NOT_CHOSEN',
}

export const getPreferredPronouns = (
  selectedPronoun: string
): preferredPronouns => {
  switch (selectedPronoun) {
    case 'SHE_HER':
      return preferredPronouns.she_her;
    case 'HE_HIM':
      return preferredPronouns.he_him;
    case 'THEY_THEM':
      return preferredPronouns.they_them;
    case 'OTHER':
      return preferredPronouns.other;
    default:
      return preferredPronouns.forgo;
  }
};

export default preferredPronouns;
