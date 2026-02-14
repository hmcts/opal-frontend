/**
 * @file mac.account-details.locators.ts
 * @description Task list selectors for Manual Account Creation **Account details** page.
 *
 * @remarks
 * - Maps task display names to stable taskListItemId attributes.
 * - Used by Cypress flows/actions to open tasks and assert statuses.
 */
export type MacAccountTaskName =
  | 'Account comments and notes'
  | 'Company details'
  | 'Contact details'
  | 'Court details'
  | 'Employer details'
  | 'Parent or guardian details'
  | 'Personal details'
  | 'Offence details'
  | 'Payment terms';

const TASK_IDS: Record<MacAccountTaskName, string> = {
  'Account comments and notes': 'accountCommentsAndNotesItem',
  'Company details': 'companyDetailsItem',
  'Contact details': 'contactDetailsItem',
  'Court details': 'courtDetailsItem',
  'Employer details': 'employerDetailsItem',
  'Parent or guardian details': 'parentOrGuardianDetailsItem',
  'Personal details': 'personalDetailsItem',
  'Offence details': 'offenceDetailsItem',
  'Payment terms': 'paymentTermsItem',
};

export const MacAccountDetailsLocators = {
  checkAccountButton: 'button[id="checkAccountButton"]',
  dataPage: 'opal-lib-govuk-summary-list',
  backLink: 'a.govuk-back-link',
  pageTitle: 'h1.govuk-heading-l',
  pageHeader: 'h1.govuk-heading-l',
  businessUnit: 'div[summaryListRowId="businessUnit"]',
  accountType: 'div[summaryListRowId="accountType"]',
  defendantType: 'div[summaryListRowId="defendantType"]',
  languagePreferences: 'div[summaryListRowId="languagePreferences"]',
  courtDetails: 'opal-lib-govuk-task-list[taskListId="courtDetails"]',
  defendantDetails: 'opal-lib-govuk-task-list[taskListId="defendantDetails"]',
  parentOrGuardianDetails: 'opal-lib-govuk-task-list[taskListId="parentOrGuardianDetails"]',
  offenceAndImpositionDetails: 'opal-lib-govuk-task-list[taskListId="offenceAndImpositionDetails"]',
  accountCommentsAndNotes: 'opal-lib-govuk-task-list[taskListId="accountCommentsAndNotes"]',
  deleteAccountLink: 'a.govuk-link.govuk-error-colour',
  contactDetails: 'opal-lib-govuk-task-list-item[taskListItemId="contactDetailsItem"]',
  employerDetails: 'opal-lib-govuk-task-list-item[taskListItemId="employerDetailsItem"]',
  companyDetails: 'opal-lib-govuk-task-list-item[taskListItemId="companyDetailsItem"]',
  personalDetails: 'opal-lib-govuk-task-list-item[taskListItemId="personalDetailsItem"]',
  parentGuardianDetails: 'opal-lib-govuk-task-list-item[taskListItemId="parentOrGuardianDetailsItem"]',
  offenceDetails: 'opal-lib-govuk-task-list-item[taskListItemId="offenceDetailsItem"]',
  paymentTerms: 'opal-lib-govuk-task-list-item[taskListItemId="paymentTermsItem"]',
  accountCommentsAndNotesItem: 'opal-lib-govuk-task-list-item[taskListItemId="accountCommentsAndNotesItem"]',
  CheckDetails: 'h2.govuk-heading-m',
  CheckDetailsText: 'p.govuk-body:contains("You cannot proceed until all required sections have been completed.")',
  reviewComponent: 'app-fines-mac-review-account-history',
  status: 'strong[id = "status"]',
  reviewHistory: 'h2.govuk-heading-m',
  timeLine: 'div.moj-timeline__item',
  timeLineTitle: 'h2.moj-timeline__title',
  timelineAuthor: 'p.moj-timeline__byline',
  timelineDate: 'p.moj-timeline__date',
  timelineDescription: 'div.moj-timeline__description',
  taskList: {
    itemByName: (name: MacAccountTaskName) => `opal-lib-govuk-task-list-item[taskListItemId="${TASK_IDS[name]}"]`,
    link: 'a.govuk-link',
    status: '.govuk-task-list__status',
    name: '.govuk-task-list__name-and-hint',
  },
  summaryList: {
    languageRow: '[summarylistid="accountDetails"][summarylistrowid="languagePreferences"]',
    key: '.govuk-summary-list__key',
    value: '.govuk-summary-list__value',
    changeLink: '.govuk-summary-list__actions a',
  },
} as const;
