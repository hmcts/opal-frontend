import { FinesDraftTabFragment } from '../types/fines-draft-tab-fragment.type';

export interface IFinesDraftTabStatuses {
  tab: FinesDraftTabFragment;
  statuses: string[];
  prettyName: string;
  historicWindowInDays?: number;
}
