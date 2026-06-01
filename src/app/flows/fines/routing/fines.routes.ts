import { Routes } from '@angular/router';
import { routing as macRouting } from '../fines-mac/routing/fines-mac.routes';
import { routing as draftRouting } from '../fines-draft/routing/fines-draft.routes';
import { routing as accRouting } from '../fines-acc/routing/fines-acc.routes';
import { routing as saRouting } from '../fines-sa/routing/fines-sa.routes';
import { routing as consolidationRouting } from '../fines-con/routing/fines-con.routes';
import { routing as reportingRouting } from '../fines-reports/routing/fines-reports.routes';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { accountGuard } from '@hmcts/opal-frontend-common/guards/account';
import { featureFlagRedirectGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_SA_ROUTING_TITLES } from '../fines-sa/routing/constants/fines-sa-routing-titles.constant';
import { FINES_SA_ROUTING_PATHS } from '../fines-sa/routing/constants/fines-sa-routing-paths.constant';
import { dashboardTypeGuard } from './guards/dashboard-type/dashboard-type.guard';
import { routing as searchRouting } from '../fines-sa/fines-sa-search/routing/fines-sa-search.routes';
import { FINES_DASHBOARD_ROUTING_PATHS } from '../constants/fines-dashboard-routing-paths.constant';
import { finesSaFlowStateGuard } from '../fines-sa/guards/fines-sa-flow-state/fines-sa-flow-state.guard';
import {
  finesSaCompanyDefendantAccountsResolver,
  finesSaIndividualDefendantAccountsResolver,
} from '../fines-sa/routing/resolvers/fines-sa-defendant-accounts/fines-sa-defendant-accounts.resolver';
import { finesSaMinorCreditorAccountsResolver } from '../fines-sa/routing/resolvers/fines-sa-minor-creditor-accounts/fines-sa-minor-creditor-accounts.resolver';
import { dashboardLandingGuard } from './guards/dashboard-landing/dashboard-landing.guard';
import { finesSectionPermissionsGuard } from './guards/fines-section-permissions/fines-section-permissions.guard';
import { PRIMARY_NAV_HIDDEN_ROUTE_DATA } from '@app/constants/route-data.constant';
import { RELEASE_1A_FEATURE_FLAG, RELEASE_1B_FEATURE_FLAG } from '../constants/release-feature-flags.constant';

export const release1aFeatureFlagGuard = featureFlagRedirectGuard(RELEASE_1A_FEATURE_FLAG);
export const release1bFeatureFlagGuard = featureFlagRedirectGuard(RELEASE_1B_FEATURE_FLAG);

export const finesRouting: Routes = [
  {
    path: FINES_ROUTING_PATHS.root,
    redirectTo: `${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}`,
    pathMatch: 'full',
  },
  {
    path: FINES_ROUTING_PATHS.root,
    loadComponent: () => import('../fines.component').then((c) => c.FinesComponent),
    canActivateChild: [accountGuard],
    children: [
      {
        path: FINES_DASHBOARD_ROUTING_PATHS.root,
        loadComponent: () => import('../../../pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        canActivate: [authGuard, dashboardLandingGuard],
        pathMatch: 'full',
      },
      {
        path: `${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.search}`,
        loadComponent: () => import('../fines-sa/fines-sa.component').then((c) => c.FinesSaComponent),
        children: [
          {
            path: FINES_SA_ROUTING_PATHS.children.results,
            loadComponent: () =>
              import('../fines-sa/fines-sa-results/fines-sa-results.component').then((c) => c.FinesSaResultsComponent),
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
            loadComponent: () =>
              import('../fines-sa/fines-sa-search/fines-sa-search.component').then((c) => c.FinesSaSearchComponent),
            children: searchRouting,
            canActivate: [authGuard],
            canDeactivate: [canDeactivateGuard],
            data: {
              title: FINES_SA_ROUTING_TITLES.children.search,
            },
            resolve: {
              title: TitleResolver,
            },
          },
        ],
        canActivate: [authGuard, finesSectionPermissionsGuard],
        data: {
          sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search,
        },
      },
      {
        path: `${FINES_DASHBOARD_ROUTING_PATHS.root}/:dashboardType`,
        loadComponent: () => import('../../../pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        canActivate: [authGuard, dashboardTypeGuard, finesSectionPermissionsGuard],
      },
      {
        path: FINES_ROUTING_PATHS.children.mac.root,
        loadComponent: () => import('../fines-mac/fines-mac.component').then((c) => c.FinesMacComponent),
        children: macRouting,
        canActivate: [authGuard, release1aFeatureFlagGuard],
        canActivateChild: [release1aFeatureFlagGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          ...PRIMARY_NAV_HIDDEN_ROUTE_DATA,
        },
      },
      {
        path: FINES_ROUTING_PATHS.children.draft.root,
        loadComponent: () => import('../fines-draft/fines-draft.component').then((c) => c.FinesDraftComponent),
        children: draftRouting,
        canActivate: [authGuard, release1aFeatureFlagGuard, finesSectionPermissionsGuard],
        canActivateChild: [release1aFeatureFlagGuard],
        data: {
          sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
        },
      },
      {
        path: FINES_ROUTING_PATHS.children.acc.root,
        loadComponent: () => import('../fines-acc/fines-acc.component').then((c) => c.FinesAccComponent),
        children: accRouting,
        canActivate: [authGuard, release1bFeatureFlagGuard],
        canActivateChild: [release1bFeatureFlagGuard],
      },
      {
        path: FINES_ROUTING_PATHS.children.sa.root,
        loadComponent: () => import('../fines-sa/fines-sa.component').then((c) => c.FinesSaComponent),
        children: saRouting,
        canActivate: [authGuard, finesSectionPermissionsGuard],
        data: {
          sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search,
        },
      },
      {
        path: FINES_ROUTING_PATHS.children.con.root,
        loadComponent: () => import('../fines-con/fines-con.component').then((c) => c.FinesConComponent),
        children: consolidationRouting,
        canActivate: [authGuard, finesSectionPermissionsGuard],
        data: {
          sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
          ...PRIMARY_NAV_HIDDEN_ROUTE_DATA,
        },
      },
      {
        path: FINES_ROUTING_PATHS.children.reports.root,
        loadComponent: () => import('../fines-reports/fines-reports.component').then((c) => c.FinesReportsComponent),
        children: reportingRouting,
        canActivate: [authGuard, finesSectionPermissionsGuard],
        data: {
          sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.reports,
        },
      },
    ],
  },
];
