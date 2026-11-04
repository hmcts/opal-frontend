export const FINES_API_ALLOCATE_CONTENT = {
  heading: 'Allocate processed tills',
  hint: 'Select the tills you want to allocate.',
  emptyState: 'There are no tills ready to allocate',
  refresh: 'Refresh',
  allocate: 'Allocate',
  selectAtLeastOneTill: 'Select at least 1 till to allocate.',
  invalidSelection: 'Unable to allocate the selected tills. Refresh the page and try again.',
  errorPrefix: 'Error:',
  cashListReport: 'cash list report',
  /** Builds the acknowledgement without claiming allocation has completed. */
  sentForAllocation: (count: number): string => `${count} ${count === 1 ? 'till is' : 'tills are'} being allocated.`,
  /**
   * Builds the processing-summary introduction with singular or plural wording.
   * @param count The number of files still processing.
   * @returns The processing total followed by a colon introducing the business-unit breakdown.
   */
  processingTotal: (count: number): string =>
    `${count} ${count === 1 ? 'file is' : 'files are'} still being processed:`,
} as const;
