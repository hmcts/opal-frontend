import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
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
    data: {
      title: FINES_SUSPENSE_ITEM_ROUTING_TITLES.children.search,
    },
    resolve: {
      title: TitleResolver,
      // TODO(PO-9763): Apply suspense BU permissions when the permission contract is available.
      businessUnits: fetchBusinessUnitsResolver,
    },
  },
];
