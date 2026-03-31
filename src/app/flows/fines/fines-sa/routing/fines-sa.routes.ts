import { Routes } from '@angular/router';
import { FINES_SA_ROUTING_PATHS } from './constants/fines-sa-routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_SA_ROUTING_TITLES } from './constants/fines-sa-routing-titles.constant';
import { finesSaFlowStateGuard } from '../guards/fines-sa-flow-state/fines-sa-flow-state.guard';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { finesSaMinorCreditorAccountsResolver } from './resolvers/fines-sa-minor-creditor-accounts/fines-sa-minor-creditor-accounts.resolver';
import {
  finesSaCompanyDefendantAccountsResolver,
  finesSaIndividualDefendantAccountsResolver,
} from './resolvers/fines-sa-defendant-accounts/fines-sa-defendant-accounts.resolver';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../../constants/fines-dashboard-routing-paths.constant';

export const routing: Routes = [
  {
    path: FINES_SA_ROUTING_PATHS.children.search,
    redirectTo: `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.search}`,
    pathMatch: 'prefix',
  },
  {
    path: FINES_SA_ROUTING_PATHS.children.results,
    loadComponent: () =>
      import('../fines-sa-results/fines-sa-results.component').then((c) => c.FinesSaResultsComponent),
    canActivate: [authGuard, finesSaFlowStateGuard],
    data: {
      title: FINES_SA_ROUTING_TITLES.children.results,
    },
    resolve: {
      title: TitleResolver,
      individualAccounts: finesSaIndividualDefendantAccountsResolver,
      companyAccounts: finesSaCompanyDefendantAccountsResolver,
      minorCreditorAccounts: finesSaMinorCreditorAccountsResolver,
    },
  },
  {
    path: '',
    redirectTo: FINES_SA_ROUTING_PATHS.children.search,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: FINES_SA_ROUTING_TITLES.children.search,
    pathMatch: 'full',
  },
];
