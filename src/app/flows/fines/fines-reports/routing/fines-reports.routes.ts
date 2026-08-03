import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from './constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';
import { finesReportsReportMetadataResolver } from './resolvers/fines-reports-report-metadata/fines-reports-report-metadata.resolver';
import { finesReportsReportInstancesResolver } from './resolvers/fines-reports-report-instances/fines-reports-report-instances.resolver';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';
import { finesReportsReportHeadingResolver } from './resolvers/fines-reports-report-heading/fines-reports-report-heading.resolver';

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
        children: [
          {
            path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
            loadComponent: () =>
              import('../fines-reports-select-business-units/fines-reports-select-business-units.component').then(
                (c) => c.FinesReportsSelectBusinessUnitsComponent,
              ),
            canDeactivate: [canDeactivateGuard],
            data: {
              title: 'Select business units',
            },
            resolve: {
              title: TitleResolver,
              reportHeading: finesReportsReportHeadingResolver,
              businessUnits: finesReportsBusinessUnitsResolver,
            },
          },
        ],
      },
      {
        path: `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
        loadComponent: () =>
          import('../fines-reports-report-summary/fines-reports-report-summary.component').then(
            (c) => c.FinesReportsReportSummaryComponent,
          ),
        data: {
          title: FINES_REPORTS_ROUTING_TITLES.children.reportSummary,
        },
        resolve: {
          title: TitleResolver,
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
