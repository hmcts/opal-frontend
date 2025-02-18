import { IOpalFinesDraftAccountParams } from '../interfaces/opal-fines-draft-account-params.interface';
export const OPAL_FINES_DRAFT_ACCOUNT_PARAMS_MOCK: IOpalFinesDraftAccountParams = {
  businessUnitIds: [1, 2],
  statuses: ['Submitted', 'Resubmitted'],
  submittedBy: ['user1', 'user2'],
  notSubmittedBy: ['user3', 'user4'],
};
