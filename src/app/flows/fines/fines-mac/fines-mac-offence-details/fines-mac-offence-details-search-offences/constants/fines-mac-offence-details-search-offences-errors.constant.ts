import { IFinesMacOffenceDetailsSearchOffencesErrors } from '../interfaces/fines-mac-offence-details-search-offences-errors.interface';

export const FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ERRORS: IFinesMacOffenceDetailsSearchOffencesErrors = {
  fm_offence_details_search_offences_code: {
    maxlength: {
      message: 'Offence Code must be 8 characters or fewer',
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: 'Offence Code must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'Offence Code must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  fm_offence_details_search_offences_short_title: {
    maxlength: {
      message: 'Short Title must be 120 characters or fewer',
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: 'Short Title must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'Short Title must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  fm_offence_details_search_offences_act_section: {
    maxlength: {
      message: 'Act & Section must be 4000 characters or fewer',
      priority: 1,
    },
    alphabeticalTextPattern: {
      message: 'Act & Section must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'Act & Section must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
};
