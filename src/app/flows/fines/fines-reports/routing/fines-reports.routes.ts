import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.reports}`,
    pathMatch: 'full',
  },
  {
    path: ':reportId',
    canActivate: [authGuard],
    canActivateChild: [finesReportsStateGuard],
    children: [
      {
        path: '',
        redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        pathMatch: 'full',
      },
      {
        path: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        loadComponent: () =>
          import('../fines-reports-summary-list/fines-reports-summary-list.component').then(
            (c) => c.FinesReportsSummaryListComponent,
          ),
        resolve: {
          title: finesReportsTitleResolver,
        },
      },
      {
        path: FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits,
        loadComponent: () =>
          import('../fines-reports-select-business-units/fines-reports-select-business-units.component').then(
            (c) => c.FinesReportsSelectBusinessUnitsComponent,
          ),
        data: {
          title: FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits,
          requiresCreateReport: true,
        },
        resolve: {
          title: TitleResolver,
          businessUnits: fetchBusinessUnitsResolver,
        },
      },
      {
        path: FINES_REPORTS_ROUTING_PATHS.children.businessUnitWarning,
        loadComponent: () =>
          import('../fines-reports-business-unit-warning/fines-reports-business-unit-warning.component').then(
            (c) => c.FinesReportsBusinessUnitWarningComponent,
          ),
        data: {
          title: FINES_REPORTS_ROUTING_TITLES.children.businessUnitWarning,
          requiresCreateReport: true,
        },
        resolve: {
          title: TitleResolver,
        },
      },
    ],
  },
];
