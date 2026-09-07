import { FINES_API_CONTENT } from '../../constants/fines-api-content.constant';

export const FINES_API_SELECT_BUS_CONTENT = {
  heading: FINES_API_CONTENT.heading,
  legend: 'Select business units',
  errorPrefix: FINES_API_CONTENT.errorPrefix,
  tableCaption: 'Business units available for Automatic Cash Input',
  selectColumn: 'Select business units',
  selectAll: 'Select all business units',
  columns: {
    businessUnit: 'Business unit',
    filesToProcess: 'Files to process',
    tillsToAllocate: 'Tills to allocate',
  },
  emptyState: 'There are no business units available.',
  continueButton: 'Continue',
  selectBusinessUnit: (businessUnitName: string): string => `Select ${businessUnitName}`,
} as const;
