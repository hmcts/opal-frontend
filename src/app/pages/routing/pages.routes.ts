import { Routes } from '@angular/router';
import { PAGES_ROUTING_PATHS } from './constants/routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

export const routing: Routes = [
  { path: '', redirectTo: PAGES_ROUTING_PATHS.children.dashboard, pathMatch: 'full' },
  {
    path: FINES_DASHBOARD_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard,
    pathMatch: 'full',
  },
];
