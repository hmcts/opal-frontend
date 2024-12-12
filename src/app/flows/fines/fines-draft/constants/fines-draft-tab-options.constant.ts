import { IFinesDraftTabOptions } from '../interfaces/fines-draft-tab-options.interface';

export const FINES_DRAFT_TAB_OPTIONS: IFinesDraftTabOptions[] = [
  {
    id: 'inputter-in-review-tab',
    text: 'In review',
    fragment: 'review',
    activeFragment: 'review',
    inputter: true,
    checker: true,
  },
  {
    id: 'inputter-in-rejected-tab',
    text: 'Rejected',
    fragment: 'rejected',
    activeFragment: 'review',
    inputter: true,
    checker: true,
  },
  {
    id: 'inputter-in-approved-tab',
    text: 'Approved',
    fragment: 'approved',
    activeFragment: 'review',
    inputter: true,
    checker: false,
  },
  {
    id: 'inputter-in-deleted-tab',
    text: 'Deleted',
    fragment: 'deleted',
    activeFragment: 'review',
    inputter: true,
    checker: true,
  },
];
