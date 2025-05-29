import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { FinesDraftCreateAndManageTabsComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage-tabs/fines-draft-create-and-manage-tabs.component';
import { FinesDraftCreateAndManageComponent } from 'src/app/flows/fines/fines-draft/fines-draft-create-and-manage/fines-draft-create-and-manage.component';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from './fines-draft-account.mock';

export const FINES_DRAFT_CREATE_AND_MANAGE_ROUTES: Routes = [
  {
    path: '',
    component: FinesDraftCreateAndManageComponent,
    children: [
      {
        path: '',
        component: FinesDraftCreateAndManageTabsComponent,
        resolve: {
          draftAccounts: () => {
            const fn = (FinesDraftCreateAndManageTabsComponent as any)['__mockDraftAccounts'];
            return typeof fn === 'function' ? fn() : of({ count: 0, summaries: [] });
          },
          rejectedCount: () => {
            const fn = (FinesDraftCreateAndManageTabsComponent as any)['__mockRejectedCount'];
            return typeof fn === 'function' ? fn() : of(0);
          },
        },
      },
    ],
  },
];
