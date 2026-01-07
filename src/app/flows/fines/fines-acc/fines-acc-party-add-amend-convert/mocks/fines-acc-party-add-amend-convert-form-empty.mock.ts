import { IFinesAccPartyAddAmendConvertForm } from '../interfaces/fines-acc-party-add-amend-convert-form.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_STATE_MOCK } from './fines-acc-party-add-amend-convert-state.mock';

export const MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA: IFinesAccPartyAddAmendConvertForm = {
  formData: {
    ...FINES_ACC_PARTY_ADD_AMEND_CONVERT_STATE_MOCK,
    facc_party_add_amend_convert_add_alias: false,
  },
  nestedFlow: false,
};
