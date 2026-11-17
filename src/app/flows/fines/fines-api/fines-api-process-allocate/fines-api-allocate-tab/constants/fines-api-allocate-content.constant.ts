export const FINES_API_ALLOCATE_CONTENT = {
  heading: 'Allocate processed tills',
  hint: 'Select the tills you want to allocate.',
  emptyState: 'There are no outstanding tills to allocate',
  refresh: 'Refresh',
  allocate: 'Allocate',
  /**
   * Builds the processing-summary introduction with singular or plural wording.
   * @param count The number of files still processing.
   * @returns The processing total followed by a colon introducing the business-unit breakdown.
   */
  processingTotal: (count: number): string =>
    `${count} ${count === 1 ? 'file is' : 'files are'} still being processed:`,
} as const;
