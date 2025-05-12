import { IFinesMacOffenceDetailsSearchOffencesForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/interfaces/fines-mac-offence-details-search-offences-form.interface';
import { FINES_MAC_PERSONAL_DETAILS_STATE } from 'src/app/flows/fines/fines-mac/fines-mac-personal-details/constants/fines-mac-personal-details-state';
import { FINES_MAC_BUSINESS_UNIT_STATE } from 'src/app/flows/fines/fines-mac/constants/fines-mac-business-unit-state';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM } from 'src/app/flows/fines/fines-mac/fines-mac-account-comments-notes/constants/fines-mac-account-comments-notes-form';
import { FINES_MAC_ACCOUNT_DETAILS_FORM } from 'src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-form';
import { FINES_MAC_ACCOUNT_DETAILS_STATE } from 'src/app/flows/fines/fines-mac/fines-mac-account-details/constants/fines-mac-account-details-state';

//This is an example of a mock for the form with no values filled in
export const SEARCH_OFFENCES_DEFAULT_FORM_MOCK: IFinesMacOffenceDetailsSearchOffencesForm = {
  formData: {
    fm_offence_details_search_offences_code: null,
    fm_offence_details_search_offences_short_title: null,
    fm_offence_details_search_offences_act_section: null,
    fm_offence_details_search_offences_inactive: false,
  }
};
//This is an example of a mock for the form with the Offence Code field filled in with an invalid value
export const SEARCH_OFFENCES_INVALID_OFFENCE_CODE_MOCK: IFinesMacOffenceDetailsSearchOffencesForm = {
  formData: {
    fm_offence_details_search_offences_inactive: false,
    fm_offence_details_search_offences_code_length: 'ABC123mkjl',
    fm_offence_details_search_offences_short_title_length:
      'testing search offences short title length for unhappy path automation testing at component testing level for opal project',
    fm_offence_details_search_offences_act_and_section_length:
      'Add an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offenceAdd an offence',
  }
};
export const SEARCH_OFFENCES_SPECIAL_CHAR_OFFENCE_CODE_MOCK: IFinesMacOffenceDetailsSearchOffencesForm = {
  formData: {
    fm_offence_details_search_offences_code_special_char: '1234A@!',
    fm_offence_details_search_offences_short_title_special_char: 'Test<12>',
    fm_offence_details_search_offences_act_and_section_special_char: 'section&test',
  },
};
