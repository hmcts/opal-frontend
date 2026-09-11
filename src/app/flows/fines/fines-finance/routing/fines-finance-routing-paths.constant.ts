import { IFinesFinanceRoutingPaths } from 'src/app/flows/fines/interfaces/fines-finance.interface';

export const FINES_FINANCE_ROUTING_PATHS: IFinesFinanceRoutingPaths = {
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
