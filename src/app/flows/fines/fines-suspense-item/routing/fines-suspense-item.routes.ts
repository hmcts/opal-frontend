import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { httpErrorInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-error';
import { contentDigestInterceptor } from '@hmcts/opal-frontend-common/interceptors/content-digest';
import { httpRetryInterceptor } from '@hmcts/opal-frontend-common/interceptors/http-retry';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { finesSuspenseItemNotFoundInterceptor } from './interceptors/fines-suspense-item-not-found.interceptor';
import { finesSuspenseItemSummaryResolver } from './resolvers/fines-suspense-item-summary.resolver';
import { finesSuspenseItemFlowStateGuard } from './guards/fines-suspense-item-flow-state.guard';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { finesSuspenseBusinessUnitsResolver } from './resolvers/fines-suspense-business-units.resolver';
import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_SUSPENSE_ITEM_ROUTING_PATHS } from './constants/fines-suspense-item-routing-paths.constant';
import { FINES_SUSPENSE_ITEM_ROUTING_TITLES } from './constants/fines-suspense-item-routing-titles.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    pathMatch: 'full',
  },
  {
    path: FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.search,
    loadComponent: () =>
      import('../fines-suspense-item-search/fines-suspense-item-search.component').then(
        (c) => c.FinesSuspenseItemSearchComponent,
      ),
    canActivate: [routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_SUSPENSE_ITEM_ROUTING_TITLES.children.search,
      routePermissionId: [FINES_PERMISSIONS['view-suspense-items'], FINES_PERMISSIONS['manage-suspense-items']],
    },
    resolve: {
      title: TitleResolver,
      businessUnits: finesSuspenseBusinessUnitsResolver,
    },
  },
  {
    path: FINES_SUSPENSE_ITEM_ROUTING_PATHS.children.results,
    providers: [
      provideHttpClient(
        withFetch(),
        withInterceptors([
          httpErrorInterceptor,
          finesSuspenseItemNotFoundInterceptor,
          contentDigestInterceptor,
          httpRetryInterceptor,
        ]),
        withInterceptorsFromDi(),
      ),
      OpalFines,
    ],
    canActivate: [routePermissionsGuard, finesSuspenseItemFlowStateGuard],
    runGuardsAndResolvers: 'always',
    loadComponent: () =>
      import('../fines-suspense-item-results/fines-suspense-item-results.component').then(
        (c) => c.FinesSuspenseItemResultsComponent,
      ),
    data: {
      title: FINES_SUSPENSE_ITEM_ROUTING_TITLES.children.results,
      routePermissionId: [FINES_PERMISSIONS['view-suspense-items'], FINES_PERMISSIONS['manage-suspense-items']],
    },
    resolve: {
      title: TitleResolver,
      summary: finesSuspenseItemSummaryResolver,
    },
  },
];
