import { FINES_API_CONTENT } from '../../../constants/fines-api-content.constant';

export const FINES_API_PROCESS_CONTENT = {
  heading: 'Process files',
  hint: 'Select the files you want to process',
  refreshButton: 'Refresh',
  processButton: 'Process',
  emptyState: 'There are no uploaded files to process',
  errorPrefix: FINES_API_CONTENT.errorPrefix,
} as const;
