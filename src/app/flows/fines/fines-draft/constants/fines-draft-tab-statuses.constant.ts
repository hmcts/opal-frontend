import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';
import { IFinesDraftTabStatuses } from '../interfaces/fines-draft-tab-statuses.interface';

export const FINES_DRAFT_TAB_STATUSES: IFinesDraftTabStatuses[] = [
  {
    tab: 'review',
    statuses: [OpalFinesDraftAccountStatuses.submitted, OpalFinesDraftAccountStatuses.resubmitted],
    prettyName: 'In review',
  },
  {
    tab: 'rejected',
    statuses: [OpalFinesDraftAccountStatuses.rejected],
    prettyName: 'Rejected',
  },
  {
    tab: 'approved',
    statuses: [OpalFinesDraftAccountStatuses.approved],
    prettyName: 'Approved',
  },
  {
    tab: 'deleted',
    statuses: [OpalFinesDraftAccountStatuses.deleted],
    prettyName: 'Deleted',
    historicWindowInDays: 7,
  },
  {
    tab: 'error',
    statuses: [OpalFinesDraftAccountStatuses.errorInPublishing],
    prettyName: 'Error',
  },
];
