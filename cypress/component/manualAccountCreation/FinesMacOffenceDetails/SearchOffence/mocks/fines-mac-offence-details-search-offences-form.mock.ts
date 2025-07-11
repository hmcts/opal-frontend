import { IFinesMacOffenceDetailsSearchOffencesForm } from 'src/app/flows/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details-search-offences/interfaces/fines-mac-offence-details-search-offences-form.interface';

//This is an example of a mock for the form with no values filled in
export const SEARCH_OFFENCES_DEFAULT_FORM_MOCK: IFinesMacOffenceDetailsSearchOffencesForm = {
  formData: {
    fm_offence_details_search_offences_code: null,
    fm_offence_details_search_offences_short_title: null,
    fm_offence_details_search_offences_act_section: null,
    fm_offence_details_search_offences_inactive: false,
  },
  nestedFlow: false,
};
