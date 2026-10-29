export const FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT = {
  caption: 'Allocate processed tills',
  /**
   * Builds the selection summary displayed above the table.
   * @param count The number of selected tills.
   * @param total The number of available tills.
   * @returns The selected count relative to the total available.
   */
  selected: (count: number, total: number): string => `${count} of ${total} tills selected.`,
  selectAll: 'Select all tills',
  /**
   * Builds an accessible checkbox label identifying the till and its business unit.
   * @param number The displayed till number.
   * @param businessUnit The associated business-unit name.
   * @returns The accessible row-selection label.
   */
  selectTill: (number: number, businessUnit: string): string => `Select till ${number} for ${businessUnit}`,
  columns: {
    tillNumber: 'Till number',
    errors: 'Errors',
    fileName: 'Filename',
    source: 'Source',
    amount: 'Amount',
    businessUnit: 'Business Unit',
    processedBy: 'Processed by',
    dateProcessed: 'Date processed',
  },
} as const;
