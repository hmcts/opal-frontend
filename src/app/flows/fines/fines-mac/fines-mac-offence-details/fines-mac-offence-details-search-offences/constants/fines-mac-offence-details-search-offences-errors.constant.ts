import { IFinesMacOffenceDetailsSearchOffencesErrors } from '../interfaces/fines-mac-offence-details-search-offences-errors.interface';

export const FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ERRORS: IFinesMacOffenceDetailsSearchOffencesErrors = {
  fm_offence_details_search_offences_code: {
    maxlength: {
      message: 'Offence Code must be 8 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Offence Code must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_offence_details_search_offences_short_title: {
    maxlength: {
      message: 'Short Title must be 120 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Short Title must only contain letters or numbers',
      priority: 2,
    },
  },
  fm_offence_details_search_offences_act_section: {
    maxlength: {
      message: 'Act & Section must be 4000 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Act & Section must only contain letters or numbers',
      priority: 2,
    },
  },
};
