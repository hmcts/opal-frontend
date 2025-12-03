export type ManualAccountTaskName =
  | 'Account comments and notes'
  | 'Court details'
  | 'Personal details'
  | 'Offence details'
  | 'Payment terms';

const TASK_IDS: Record<ManualAccountTaskName, string> = {
  'Account comments and notes': 'accountCommentsAndNotesItem',
  'Court details': 'courtDetailsItem',
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
