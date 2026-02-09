import { IFinesConSelectBuForm } from '../interfaces/fines-con-select-bu-form.interface';

/**
 * Mock data for select business unit form with nested flow
 */
export const FINES_CON_SELECT_BU_FORM_NESTED_FLOW_MOCK: IFinesConSelectBuForm = {
  formData: {
    fcon_select_bu_business_unit_id: 1,
    fcon_select_bu_defendant_type: 'individual',
  },
  nestedFlow: true,
};
