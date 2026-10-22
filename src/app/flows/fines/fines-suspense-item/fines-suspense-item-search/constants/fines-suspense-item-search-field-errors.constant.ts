import { IFinesSuspenseItemSearchFieldErrors } from '../interfaces/fines-suspense-item-search-field-errors.interface';

// TODO(PO-9763): Confirm required-field wording and reference validation rules against the approved interaction design.
export const FINES_SUSPENSE_ITEM_SEARCH_FIELD_ERRORS: IFinesSuspenseItemSearchFieldErrors = {
  fsis_business_unit_id: {
    required: {
      message: 'Select a business unit',
      priority: 1,
    },
  },
  fsis_suspense_reference_number: {
    required: {
      message: 'Enter a suspense reference number',
      priority: 1,
    },
  },
};
