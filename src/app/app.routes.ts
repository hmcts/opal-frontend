import { routing as pagesRouting } from '@routing/pages/pages.routes';
import { routing as flowsRouting } from '@routing/flows/flows.routes';
import { routing as commonRouting } from 'opal-frontend-common';
import { Routes } from '@angular/router';

export const routes: Routes = [...commonRouting, ...pagesRouting, ...flowsRouting];
