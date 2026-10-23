import { IFinesSuspenseItemSearchFieldErrors } from '../interfaces/fines-suspense-item-search-field-errors.interface';

export const FINES_SUSPENSE_ITEM_SEARCH_FIELD_ERRORS: IFinesSuspenseItemSearchFieldErrors = {
  fsis_business_unit_id: {
    required: {
      message: 'Select a business unit',
      priority: 1,
    },
  },
  fsis_suspense_reference_number: {
    required: {
      message: 'Enter suspense reference number',
      priority: 1,
    },
    numericalTextPattern: {
      message: 'Enter suspense reference number in the correct format',
      priority: 2,
    },
  },
};
