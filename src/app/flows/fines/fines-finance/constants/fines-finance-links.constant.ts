import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';

const FINES_FINANCE_LINK_DEFAULTS: Pick<IDashboardPageConfigurationLink, 'fragment' | 'newTab' | 'style'> = {
  fragment: null,
  newTab: false,
  style: 'guidance-panel-blue',
};
const FINES_FINANCE_ROUTE_PREFIX = ['/', FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.finance.root];
const FINES_FINANCE_CHILD_PATHS = FINES_ROUTING_PATHS.children.finance.children;

export const FINES_FINANCE_LINKS: IDashboardPageConfigurationLink[] = [
  {
    ...FINES_FINANCE_LINK_DEFAULTS,
    id: 'finesFinanceInboundFilesLink',
    text: 'Inbound files',
    routerLink: [
      ...FINES_FINANCE_ROUTE_PREFIX,
      FINES_FINANCE_CHILD_PATHS['inbound'],
      FINES_FINANCE_CHILD_PATHS['search'],
    ],
    permissionIds: [FINES_PERMISSIONS['view-interface-files']],
  },
  {
    ...FINES_FINANCE_LINK_DEFAULTS,
    id: 'finesFinanceOutboundFilesLink',
    text: 'Outbound files',
    routerLink: [
      ...FINES_FINANCE_ROUTE_PREFIX,
      FINES_FINANCE_CHILD_PATHS['outbound'],
      FINES_FINANCE_CHILD_PATHS['search'],
    ],
    permissionIds: [FINES_PERMISSIONS['view-interface-files']],
  },
  {
    ...FINES_FINANCE_LINK_DEFAULTS,
    id: 'finesFinanceUploadVariantBankingFilesLink',
    text: 'Upload variant banking files',
    routerLink: [
      ...FINES_FINANCE_ROUTE_PREFIX,
      FINES_FINANCE_CHILD_PATHS['variantBankingFiles'],
      FINES_FINANCE_CHILD_PATHS['upload'],
    ],
    permissionIds: [FINES_PERMISSIONS['create-interface-files']],
  },
];
