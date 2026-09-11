import { IFinesFinanceRoutingPaths } from './interfaces/fines-finance-routing-paths.interface';

export const FINES_FINANCE_ROUTING_PATHS: IFinesFinanceRoutingPaths = {
  root: 'finance',
  children: {
    search: 'search',
    inbound: 'inbound-files',
    outbound: 'outbound-files',
    variantBankingFiles: 'variant-banking-files',
    upload: 'upload',
  },
};
