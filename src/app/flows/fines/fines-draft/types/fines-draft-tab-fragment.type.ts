import { FINES_DRAFT_TAB_FRAGMENT } from '../constants/fines-draft-tab-fragments.constant';

export type FinesDraftTabFragment = (typeof FINES_DRAFT_TAB_FRAGMENT)[keyof typeof FINES_DRAFT_TAB_FRAGMENT];
