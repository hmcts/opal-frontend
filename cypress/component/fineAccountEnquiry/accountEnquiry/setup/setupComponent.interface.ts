import { Provider } from '@angular/core';
import { Routes } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';

export interface IComponentProperties {
  accountId: string | `${number}`;
  routeRoot?: 'defendant' | 'minor-creditor';
  routeSegments?: string[];
  targetPath?: string;
  routerConfig?: Routes;
  additionalProviders?: Provider[];
  globalStoreFactory?: () => GlobalStore;
  finesAccountStoreFactory?: () => FinesAccountStore;
  fragments:
    | 'at-a-glance'
    | 'defendant'
    | 'parent-or-guardian'
    | 'payment-terms'
    | 'enforcement'
    | 'impositions'
    | 'history-and-notes'
    | 'fixed-penalty'
    | 'payment-terms'
    | undefined;
  interceptedRoutes?: string[];
}
