export const FINES_MCI_CRIMINAL_SEARCH_RESULTS = {
  matches: 'matches',
  noMatches: 'no-matches',
  tooMany: 'too-many',
  searchCriteriaCannotBeCombined: 'search-criteria-cannot-be-combined',
} as const;

export type FinesMciCriminalSearchResults =
  (typeof FINES_MCI_CRIMINAL_SEARCH_RESULTS)[keyof typeof FINES_MCI_CRIMINAL_SEARCH_RESULTS];
