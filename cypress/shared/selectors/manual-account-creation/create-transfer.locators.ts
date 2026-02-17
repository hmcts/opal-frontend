/**
 * Locators for the Create New or Transfer In account page in the manual account creation flow.
 * Contains CSS selectors for interacting with page elements including the page header,
 * originator type radio buttons (create new or transfer in), and action buttons.
 *
 * @property {string} pageHeader - Selector for the main page heading element
 * @property {Object} originatorType - Container for originator type radio button selectors
 * @property {string} originatorType.createNew - Selector for the "Create New" radio button option
 * @property {string} originatorType.transferIn - Selector for the "Transfer In" radio button option
 * @property {string} continueButton - Selector for the form submission button
 * @property {string} cancelLink - Selector for the cancel/back link
 *
 * @readonly
 */
export const CreateNewOrTransferInLocators = {
  pageHeader: 'h1.govuk-heading-l',
  originatorType: {
    createNew: 'input[id="fm_originator_type_originator_type-NEW"]',
    transferIn: 'input[id="fm_originator_type_originator_type-TFO"]',
  },
  continueButton: 'button[id="submitForm"]',
  cancelLink: 'a.govuk-link.button-link',
} as const;
