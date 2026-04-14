/**
 * @file account.enquiry.collection-order-change.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Change Collection Order status** form.
 * Covers page headings, radios, navigation links, and action controls.
 *
 * @remarks
 * - Use these selectors in Cypress tests to avoid local selector duplication.
 * - Prefer ID-based selectors where the component provides them.
 */
export const COLLECTION_ORDER_CHANGE_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  pageHeading: 'h1.govuk-heading-l',
  form: 'app-fines-acc-enf-collo-change-form form',
  introText: 'app-fines-acc-enf-collo-change-form p.govuk-body:first-of-type',
  warningText: 'app-fines-acc-enf-collo-change-form p.govuk-body.govuk-\\!-font-weight-bold',

  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  fieldError: '#facc_enf_collection_order_made-error-message',
  goBackLink: '#facc_enf_collection_order_go_back',

  collectionOrderFieldset: 'fieldset#facc_enf_collection_order_made',
  collectionOrderLegend: 'fieldset#facc_enf_collection_order_made legend',
  yesRadio: 'input[name="facc_enf_collection_order_made"][value="true"]',
  yesRadioLabel: 'label[for="facc_enf_collection_order_made-facc_enf_collection_order_made_true"]',
  noRadio: 'input[name="facc_enf_collection_order_made"][value="false"]',
  noRadioLabel: 'label[for="facc_enf_collection_order_made-facc_enf_collection_order_made_false"]',

  submitButton: 'button#submitForm',
  cancelLink: 'opal-lib-govuk-cancel-link a',
} as const;
