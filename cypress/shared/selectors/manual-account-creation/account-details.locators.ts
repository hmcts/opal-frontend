/**
 * @file account-details.locators.ts
 * @description Task list selectors for Manual Account Creation **Account details** page.
 *
 * @remarks
 * - Maps task display names to stable taskListItemId attributes.
 * - Used by Cypress flows/actions to open tasks and assert statuses.
 */
export type ManualAccountTaskName =
  | 'Account comments and notes'
  | 'Company details'
  | 'Contact details'
  | 'Court details'
  | 'Employer details'
  | 'Parent or guardian details'
  | 'Personal details'
  | 'Offence details'
  | 'Payment terms';

const TASK_IDS: Record<ManualAccountTaskName, string> = {
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

export const ManualAccountDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  taskList: {
    itemByName: (name: ManualAccountTaskName) => `opal-lib-govuk-task-list-item[taskListItemId="${TASK_IDS[name]}"]`,
    link: 'a.govuk-link',
    status: '.govuk-task-list__status',
    name: '.govuk-task-list__name-and-hint',
  },
} as const;
