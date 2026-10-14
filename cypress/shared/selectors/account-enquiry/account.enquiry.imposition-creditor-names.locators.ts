/**
 * Gets the stable selector for a creditor cell in the Account Enquiry Impositions tab.
 *
 * @param rowIndex - Zero-based row index in the impositions table.
 * @returns The CSS selector for the creditor cell.
 */
export const getImpositionCreditorCell = (rowIndex: number): string => `#imposition-creditor-${rowIndex}`;

/**
 * Gets the stable selector for a creditor link in the Account Enquiry Impositions tab.
 *
 * @param rowIndex - Zero-based row index in the impositions table.
 * @returns The CSS selector for the creditor link.
 */
export const getImpositionCreditorLink = (rowIndex: number): string => `${getImpositionCreditorCell(rowIndex)} a`;
