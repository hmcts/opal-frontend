import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
export const FINES_EXTERNAL_BANKING_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesExternalBankingInboundFilesLink',
    text: 'Inbound files',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.finance.root,
      FINES_ROUTING_PATHS.children.finance.children['inbound'],
      FINES_ROUTING_PATHS.children.finance.children['search'],
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
  {
    id: 'finesExternalBankingOutboundFilesLink',
    text: 'Outbound files',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.finance.root,
      FINES_ROUTING_PATHS.children.finance.children['outbound'],
      FINES_ROUTING_PATHS.children.finance.children['search'],
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
  {
    id: 'finesExternalBankingUploadFilesLink',
    text: 'Upload Variant banking files',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.finance.root,
      FINES_ROUTING_PATHS.children.finance.children['variantbankingfiles'],
      FINES_ROUTING_PATHS.children.finance.children['upload'],
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
];
