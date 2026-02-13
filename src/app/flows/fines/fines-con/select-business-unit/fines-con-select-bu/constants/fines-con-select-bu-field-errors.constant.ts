import { IFinesConSelectBuFieldErrors } from '../interfaces/fines-con-select-bu-field-errors.interface';

export const FINES_CON_SELECT_BU_FIELD_ERRORS: IFinesConSelectBuFieldErrors = {
  fcon_select_bu_business_unit_id: {
    required: {
      message: 'Select a business unit',
      priority: 1,
    },
  },
  fcon_select_bu_defendant_type: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
};
