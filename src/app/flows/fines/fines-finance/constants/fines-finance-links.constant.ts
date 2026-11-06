import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { type FinesPermissionCode } from '@app/constants/fines-permissions.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

const FINES_FINANCE_ROUTE_PREFIX = ['/', FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.finance.root] as const;

const FINES_FINANCE_LINK_DEFAULTS = {
  fragment: null,
  newTab: false,
  style: 'guidance-panel-blue',
} as const;

const createFinesFinanceLink = (
  id: string,
  text: string,
  route: readonly string[],
  permissionCode: FinesPermissionCode,
): IFinesDashboardConfigurationLink => ({
  id,
  text,
  routerLink: [...FINES_FINANCE_ROUTE_PREFIX, ...route],
  ...FINES_FINANCE_LINK_DEFAULTS,
  permissionCodes: [permissionCode],
});

export const FINES_FINANCE_LINKS: IFinesDashboardConfigurationLink[] = [
  createFinesFinanceLink(
    'finesFinanceInboundFilesLink',
    'Inbound files',
    [FINES_ROUTING_PATHS.children.finance.children['inbound'], FINES_ROUTING_PATHS.children.finance.children['search']],
    FINES_PERMISSIONS['view-interface-files'],
  ),
  createFinesFinanceLink(
    'finesFinanceOutboundFilesLink',
    'Outbound files',
    [
      FINES_ROUTING_PATHS.children.finance.children['outbound'],
      FINES_ROUTING_PATHS.children.finance.children['search'],
    ],
    FINES_PERMISSIONS['view-interface-files'],
  ),
  createFinesFinanceLink(
    'finesFinanceUploadVariantBankingFilesLink',
    'Upload variant banking files',
    [
      FINES_ROUTING_PATHS.children.finance.children['variantBankingFiles'],
      FINES_ROUTING_PATHS.children.finance.children['upload'],
    ],
    FINES_PERMISSIONS['create-interface-files'],
  ),
];
