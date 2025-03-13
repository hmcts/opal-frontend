import { Routes } from '@angular/router';
import { FinesDraftCamInputterComponent } from 'src/app/flows/fines/fines-draft/fines-draft-cam/fines-draft-cam-inputter/fines-draft-cam-inputter.component';

export const routes: Routes = [
  {
    path: 'manual-account-creation',
    component: FinesDraftCamInputterComponent,
    children: [
      { path: 'review', component: FinesDraftCamInputterComponent },
      { path: 'rejected', component: FinesDraftCamInputterComponent },
      { path: 'approved', component: FinesDraftCamInputterComponent },
      { path: 'deleted', component: FinesDraftCamInputterComponent },
      { path: '', redirectTo: 'review', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'manual-account-creation' },
];
