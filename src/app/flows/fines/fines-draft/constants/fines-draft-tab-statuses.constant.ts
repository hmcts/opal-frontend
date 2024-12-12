import { OpalFinesDraftAccountStatuses } from '@services/fines/opal-fines-service/enums/opal-fines-draft-account-statuses.enum';
import { IFinesDraftTabStatues } from '../interfaces/fines-draft-tab-statuses.interface';

export const FINES_DRAFT_TAB_STATUSES: IFinesDraftTabStatues[] = [
  {
    tab: 'review',
    statuses: [OpalFinesDraftAccountStatuses.submitted, OpalFinesDraftAccountStatuses.resubmitted],
  },
  {
    tab: 'rejected',
    statuses: [OpalFinesDraftAccountStatuses.rejected],
  },
  {
    tab: 'approved',
    statuses: [OpalFinesDraftAccountStatuses.approved],
  },
  {
    tab: 'deleted',
    statuses: [OpalFinesDraftAccountStatuses.deleted],
  },
  {
    tab: 'error',
    statuses: [OpalFinesDraftAccountStatuses.errorInPublishing],
  },
];
