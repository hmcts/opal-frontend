import { IFinesConSelectBuForm } from '../interfaces/fines-con-select-bu-form.interface';
import { FINES_CON_SELECT_BU_FORM_DATA_MOCK } from './fines-con-select-bu-form-data.mock';

/**
 * Mock data for select business unit form with company defendant type
 */
export const FINES_CON_SELECT_BU_FORM_COMPANY_MOCK: IFinesConSelectBuForm = {
  formData: {
    ...FINES_CON_SELECT_BU_FORM_DATA_MOCK,
    fcon_select_bu_defendant_type: 'company',
  },
  nestedFlow: false,
};
