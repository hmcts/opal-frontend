import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';

const FINES_FINANCE_ROUTE_PREFIX = ['/', FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.finance.root] as const;

const FINES_FINANCE_LINK_DEFAULTS = {
  fragment: null,
  newTab: false,
  style: 'guidance-panel-blue',
} as const;

export const FINES_FINANCE_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesFinanceInboundFilesLink',
    text: 'Inbound files',
    routerLink: [
      ...FINES_FINANCE_ROUTE_PREFIX,
      FINES_ROUTING_PATHS.children.finance.children['inbound'],
      FINES_ROUTING_PATHS.children.finance.children['search'],
    ],
    ...FINES_FINANCE_LINK_DEFAULTS,
    permissionIds: [FINES_PERMISSIONS['view-interface-files']],
  },
  {
    id: 'finesFinanceOutboundFilesLink',
    text: 'Outbound files',
    routerLink: [
      ...FINES_FINANCE_ROUTE_PREFIX,
      FINES_ROUTING_PATHS.children.finance.children['outbound'],
      FINES_ROUTING_PATHS.children.finance.children['search'],
    ],
    ...FINES_FINANCE_LINK_DEFAULTS,
    permissionIds: [FINES_PERMISSIONS['view-interface-files']],
  },
  {
    id: 'finesFinanceUploadVariantBankingFilesLink',
    text: 'Upload variant banking files',
    routerLink: [
      ...FINES_FINANCE_ROUTE_PREFIX,
      FINES_ROUTING_PATHS.children.finance.children['variantBankingFiles'],
      FINES_ROUTING_PATHS.children.finance.children['upload'],
    ],
    ...FINES_FINANCE_LINK_DEFAULTS,
    permissionIds: [FINES_PERMISSIONS['create-interface-files']],
  },
];
