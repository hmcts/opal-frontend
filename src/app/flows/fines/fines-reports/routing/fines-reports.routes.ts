import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { finesReportsAccessGuard } from './guards/fines-reports-access-guard/fines-reports-access.guard';
import { finesReportsCreateStateGuard } from './guards/fines-reports-create-state-guard/fines-reports-create-state.guard';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { fetchReportResolver } from './resolvers/fetch-report/fetch-report.resolver';
import { finesReportsReportHeadingResolver } from './resolvers/fines-reports-report-heading/fines-reports-report-heading.resolver';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from './constants/fines-reports-create-routing-paths.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.reports}`,
    pathMatch: 'full',
  },
  {
    path: ':reportTypeId',
    canActivate: [authGuard, finesReportsAccessGuard],
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
          report: fetchReportResolver,
        },
      },
      {
        path: FINES_REPORTS_ROUTING_PATHS.children.create,
        canActivateChild: [finesReportsCreateStateGuard],
        children: [
          {
            path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
            loadComponent: () =>
              import('../fines-reports-select-business-units/fines-reports-select-business-units.component').then(
                (c) => c.FinesReportsSelectBusinessUnitsComponent,
              ),
            canDeactivate: [canDeactivateGuard],
            data: {
              title: FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits,
            },
            resolve: {
              title: TitleResolver,
              report: fetchReportResolver,
              reportHeading: finesReportsReportHeadingResolver,
              businessUnits: fetchBusinessUnitsResolver,
            },
          },
          {
            path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning,
            loadComponent: () =>
              import('../fines-reports-business-unit-warning/fines-reports-business-unit-warning.component').then(
                (c) => c.FinesReportsBusinessUnitWarningComponent,
              ),
            data: {
              title: FINES_REPORTS_ROUTING_TITLES.children.businessUnitWarning,
              requiresSelectedBusinessUnits: true,
            },
            resolve: {
              title: TitleResolver,
            },
          },
        ],
      },
    ],
  },
];
