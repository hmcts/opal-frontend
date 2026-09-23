export const FINES_API_ALLOCATE_CONTENT = {
  heading: 'Allocate tills',
  hint: 'Select the tills you want to allocate.',
  emptyState: 'There are no outstanding tills to allocate',
  refresh: 'Refresh',
  allocate: 'Allocate',
  processingHeading: 'Files processing',
  processingTotal: (count: number): string => `${count} ${count === 1 ? 'file is' : 'files are'} processing.`,
  selected: (count: number, total: number): string => `${count} of ${total} tills selected.`,
  selectAll: 'Select all tills',
  selectTill: (number: string, businessUnit: string): string => `Select till ${number} for ${businessUnit}`,
  columns: ['Till number', 'Errors', 'Filename', 'Source', 'Amount', 'Business Unit', 'Processed by', 'Date processed'],
} as const;
