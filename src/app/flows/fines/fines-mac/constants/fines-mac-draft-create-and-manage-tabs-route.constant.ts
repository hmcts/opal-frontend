import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../../fines-draft/fines-draft-create-and-manage/routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';

export const FINES_MAC_DRAFT_CREATE_AND_MANAGE_TABS_ROUTE = {
  fragment: FINES_DRAFT_TAB_STATUSES[0].tab,
  path: [
    '',
    FINES_ROUTING_PATHS.root,
    FINES_DRAFT_ROUTING_PATHS.root,
    FINES_DRAFT_ROUTING_PATHS.children.createAndManage,
    FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.tabs,
  ].join('/'),
} as const;
