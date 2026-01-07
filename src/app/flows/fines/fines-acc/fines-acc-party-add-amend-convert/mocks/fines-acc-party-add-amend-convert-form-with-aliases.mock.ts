import { IFinesAccPartyAddAmendConvertForm } from '../interfaces/fines-acc-party-add-amend-convert-form.interface';
import { MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA } from './fines-acc-party-add-amend-convert-form.mock';

export const MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA_WITH_ALIASES: IFinesAccPartyAddAmendConvertForm = {
  formData: {
    ...MOCK_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
    facc_party_add_amend_convert_individual_aliases: [
      {
        facc_party_add_amend_convert_alias_forenames_0: 'Johnny',
        facc_party_add_amend_convert_alias_surname_0: 'Doe',
      },
    ],
    facc_party_add_amend_convert_add_alias: true, // Checkbox should be checked when aliases exist
  },
  nestedFlow: false,
};
