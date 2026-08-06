import { IFinesFinanceRoutingPaths  } from '../interfaces/fines-finance-routing-paths.interface';

export const FINES_FINANCE_ROUTING_TITLES: IFinesFinanceRoutingPaths  = {
  root: 'finance',
  children: {
    inbound: 'Inbound File Viewer',
    outbound: 'Outbound File Viewer',
    upload : 'Variant Banking File Upload',
  },
};
