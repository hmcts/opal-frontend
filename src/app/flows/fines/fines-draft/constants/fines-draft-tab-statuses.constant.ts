import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { IFinesDraftTabStatuses } from '../interfaces/fines-draft-tab-statuses.interface';

export const FINES_DRAFT_TAB_STATUSES: IFinesDraftTabStatuses[] = [
  {
    tab: 'review',
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted, OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted],
    prettyName: 'In review',
  },
  {
    tab: 'rejected',
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
    prettyName: 'Rejected',
  },
  {
    tab: 'approved',
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.approved],
    prettyName: 'Approved',
    historicWindowInDays: 7,
  },
  {
    tab: 'deleted',
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted],
    prettyName: 'Deleted',
    historicWindowInDays: 7,
  },
  {
    tab: 'failed',
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
    prettyName: 'Failed',
  },
  {
    tab: 'to-review',
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted, OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted],
    prettyName: 'To review',
  },
];
