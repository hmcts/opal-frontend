import { IFinesFinanceRoutingPaths } from '../interfaces/fines-finance-routing-paths.interface';

export const FINES_FINANCE_ROUTING_TITLES: IFinesFinanceRoutingPaths = {
  root: 'Finance',
  children: {
    inbound: 'Inbound file viewer',
    outbound: 'Outbound file viewer',
    upload: 'Variant banking file upload',
  },
};
