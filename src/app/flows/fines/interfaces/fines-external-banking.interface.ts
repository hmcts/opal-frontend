import { IChildRoutingPaths } from '@hmcts/opal-frontend-common/pages/routing/interfaces';

export interface IFinesExternalBankingRoutingPaths extends IChildRoutingPaths {
  children: {
    search: string;
    finance: string;
    inbound: string;
    outbound : string;
    variantbankingfiles : string;
    upload : string;
  };
}