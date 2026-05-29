export const FINES_ACC_ENF_ACTION_DENIED_MESSAGES = {
  heading: 'You cannot add an enforcement action',
  permission: 'You do not have the required permissions to add an enforcement action to this account.',
  enforcementHold: 'You must first remove the enforcement hold on the account.',
  noNextPermittedActionsPrefix:
    'You cannot add an enforcement action to an account that has a last enforcement action of:',
  accountStatusPrefix: 'You cannot add an enforcement action to an account that has a status of:',
} as const;
