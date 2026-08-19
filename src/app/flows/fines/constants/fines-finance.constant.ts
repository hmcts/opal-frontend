import { IFinesExternalBankingRoutingPaths } from '@app/flows/fines/interfaces/fines-external-banking.interface';

export const FINES_FINANCE_ROUTING_PATHS: IFinesExternalBankingRoutingPaths = {
  root: 'finance',
  children: {
    search: 'search',
    finance: 'finance',
    inbound: 'inbound-files',
    outbound: 'outbound-files',
    variantBankingFiles: 'variant-banking-files',
    upload: 'upload',
  },
};
