import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';
import { finesReportsReportMetadataResolver } from './resolvers/fines-reports-report-metadata/fines-reports-report-metadata.resolver';
import { finesReportsReportInstancesResolver } from './resolvers/fines-reports-report-instances/fines-reports-report-instances.resolver';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';

export const routing: Routes = [
  {
    path: '',
    redirectTo: `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.reports}`,
    pathMatch: 'full',
  },
  {
    path: ':reportTypeId',
    canActivate: [authGuard, finesReportsStateGuard],
    children: [
      {
        path: '',
        redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        pathMatch: 'full',
      },
      {
        path: FINES_REPORTS_ROUTING_PATHS.children.create,
        loadComponent: () =>
          import('../fines-reports-create/fines-reports-create.component').then((c) => c.FinesReportsCreateComponent),
        resolve: {
          title: finesReportsTitleResolver,
        },
      },
      {
        path: `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
        loadComponent: () =>
          import('../fines-reports-report-summary/fines-reports-report-summary.component').then(
            (c) => c.FinesReportsReportSummaryComponent,
          ),
        resolve: {
          title: finesReportsTitleResolver,
        },
      },
      {
        path: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        loadComponent: () =>
          import('../fines-reports-summary-list/fines-reports-summary-list.component').then(
            (c) => c.FinesReportsSummaryListComponent,
          ),
        resolve: {
          title: finesReportsTitleResolver,
          businessUnits: finesReportsBusinessUnitsResolver,
          reportMetadata: finesReportsReportMetadataResolver,
          reportInstances: finesReportsReportInstancesResolver,
        },
      },
    ],
  },
];
