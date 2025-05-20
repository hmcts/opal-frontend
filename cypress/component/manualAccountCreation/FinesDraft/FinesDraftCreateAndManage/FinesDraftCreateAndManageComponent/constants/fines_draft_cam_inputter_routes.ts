import { Routes } from '@angular/router';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';

export const routes: Routes = [
  {
    path: 'manual-account-creation',
    component: FinesDraftCreateAndManageTabsComponent,
    children: [
      { path: 'review', component: FinesDraftCreateAndManageTabsComponent },
      { path: 'rejected', component: FinesDraftCreateAndManageTabsComponent },
      { path: 'approved', component: FinesDraftCreateAndManageTabsComponent },
      { path: 'deleted', component: FinesDraftCreateAndManageTabsComponent },
      { path: '', redirectTo: 'review', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'manual-account-creation' },
];
