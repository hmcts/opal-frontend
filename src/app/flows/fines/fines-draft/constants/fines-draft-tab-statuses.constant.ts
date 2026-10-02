import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { IFinesDraftTabStatuses } from '../interfaces/fines-draft-tab-statuses.interface';
import { FINES_DRAFT_TAB_FRAGMENT } from './fines-draft-tab-fragments.constant';

export const FINES_DRAFT_TAB_STATUSES: IFinesDraftTabStatuses[] = [
  {
    tab: FINES_DRAFT_TAB_FRAGMENT.review,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted, OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted],
    prettyName: 'In review',
  },
  {
    tab: FINES_DRAFT_TAB_FRAGMENT.rejected,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
    prettyName: 'Rejected',
  },
  {
    tab: FINES_DRAFT_TAB_FRAGMENT.approved,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.approved],
    prettyName: 'Approved',
    historicWindowInDays: 7,
  },
  {
    tab: FINES_DRAFT_TAB_FRAGMENT.deleted,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted],
    prettyName: 'Deleted',
    historicWindowInDays: 7,
  },
  {
    tab: FINES_DRAFT_TAB_FRAGMENT.failed,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.publishFailed],
    prettyName: 'Failed',
  },
  {
    tab: FINES_DRAFT_TAB_FRAGMENT.toReview,
    statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted, OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted],
    prettyName: 'To review',
  },
];
