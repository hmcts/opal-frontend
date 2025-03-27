import { Routes } from '@angular/router';
import { FinesDraftCheckAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-check-and-manage/fines-draft-check-and-manage-tabs/fines-draft-check-and-manage-tabs.component';

export const routes: Routes = [
  {
    path: 'manual-account-creation',
    component: FinesDraftCheckAndManageTabsComponent,
    children: [
      { path: 'review', component: FinesDraftCheckAndManageTabsComponent },
      { path: 'rejected', component: FinesDraftCheckAndManageTabsComponent },
      { path: 'approved', component: FinesDraftCheckAndManageTabsComponent },
      { path: 'deleted', component: FinesDraftCheckAndManageTabsComponent },
      { path: '', redirectTo: 'review', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'manual-account-creation' },
];
