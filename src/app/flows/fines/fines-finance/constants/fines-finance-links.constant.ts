import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import {FINES_FINANCE_BANKING_PATHS} from 'src/app/flows/fines/constants/fines-finance.constant';

export const FINES_EXTERNAL_BANKING_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesExternalBankingInboundFilesLink',
    text: 'Inbound files',
    routerLink: [
      '/',
      FINES_FINANCE_BANKING_PATHS.root,
      FINES_FINANCE_BANKING_PATHS.children.finance,
      FINES_FINANCE_BANKING_PATHS.children.inbound,
      FINES_FINANCE_BANKING_PATHS.children.search,
      
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
      FINES_FINANCE_BANKING_PATHS.root,
      FINES_FINANCE_BANKING_PATHS.children.finance,
      FINES_FINANCE_BANKING_PATHS.children.outbound,
      FINES_FINANCE_BANKING_PATHS.children.search,
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
      FINES_FINANCE_BANKING_PATHS.root,
      FINES_FINANCE_BANKING_PATHS.children.finance,
      FINES_FINANCE_BANKING_PATHS.children.variantbankingfiles,
      FINES_FINANCE_BANKING_PATHS.children.upload,
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
];
