import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { finesReportsReportMetadataResolver } from './resolvers/fines-reports-report-metadata/fines-reports-report-metadata.resolver';
import { finesReportsReportInstancesResolver } from './resolvers/fines-reports-report-instances/fines-reports-report-instances.resolver';

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
        path: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        loadComponent: () =>
          import('../fines-reports-summary-list/fines-reports-summary-list.component').then(
            (c) => c.FinesReportsSummaryListComponent,
          ),
        resolve: {
          title: finesReportsTitleResolver,
          businessUnits: fetchBusinessUnitsResolver,
          reportMetadata: finesReportsReportMetadataResolver,
          reportInstances: finesReportsReportInstancesResolver,
        },
      },
    ],
  },
];
