import { routing as pagesRouting } from '@routing/pages/pages.routes';
import { routing as flowsRouting } from '@routing/flows/flows.routes';
import { routing as commonRouting } from '@hmcts/opal-frontend-common/pages';
import { Routes } from '@angular/router';

export const routes: Routes = [...commonRouting, ...pagesRouting, ...flowsRouting];
