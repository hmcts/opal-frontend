import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS } from '../../fines-draft/fines-draft-create-and-manage/routing/constants/fines-draft-create-and-manage-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS } from '../../fines-draft/fines-draft-check-and-validate/routing/constants/fines-draft-check-and-validate-routing-paths.constant';

export const FINES_DRAFT_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesCavInputterLink',
    text: 'Create and Manage Draft Accounts',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.draft.root,
      FINES_ROUTING_PATHS.children.draft.children['createAndManage'],
      FINES_DRAFT_CREATE_AND_MANAGE_ROUTING_PATHS.children.tabs,
    ],
    fragment: 'review',
    permissionIds: [FINES_PERMISSIONS['create-and-manage-draft-accounts']],
    newTab: false,
    style: 'guidance-panel-blue',
  },
  {
    id: 'finesCavCheckerLink',
    text: 'Check and Validate Draft Accounts',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.draft.root,
      FINES_ROUTING_PATHS.children.draft.children['checkAndValidate'],
      FINES_DRAFT_CHECK_AND_VALIDATE_ROUTING_PATHS.children.tabs,
    ],
    fragment: 'to-review',
    permissionIds: [FINES_PERMISSIONS['check-and-validate-draft-accounts']],
    newTab: false,
    style: 'guidance-panel-blue',
  },
];
