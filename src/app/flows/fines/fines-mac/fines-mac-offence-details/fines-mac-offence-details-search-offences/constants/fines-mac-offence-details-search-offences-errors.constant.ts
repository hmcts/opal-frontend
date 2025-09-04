import { IFinesMacOffenceDetailsSearchOffencesErrors } from '../interfaces/fines-mac-offence-details-search-offences-errors.interface';

export const FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ERRORS: IFinesMacOffenceDetailsSearchOffencesErrors = {
  fm_offence_details_search_offences_code: {
    maxlength: {
      message: 'Offence code must be 8 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Offence code must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_offence_details_search_offences_short_title: {
    maxlength: {
      message: 'Short title must be 120 characters or fewer',
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message:
        'Short title must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      priority: 2,
    },
  },
  fm_offence_details_search_offences_act_section: {
    maxlength: {
      message: 'Act and section must be 4,000 characters or fewer',
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message:
        'Act and section must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
      priority: 2,
    },
  },
};
