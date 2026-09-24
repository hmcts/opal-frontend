import { IFinesFinanceRoutingTitles } from '../interfaces/fines-finance-routing-titles.interface';

export const FINES_FINANCE_ROUTING_TITLES: IFinesFinanceRoutingTitles = {
  root: 'Finance',
  children: {
    inbound: 'Inbound file viewer',
    outbound: 'Outbound file viewer',
    upload: 'Variant banking file upload',
  },
};
