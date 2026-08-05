import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_FINANCE_BANKING_PATHS } from '../../constants/fines-finance.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';


export const routing: Routes = [
  {
      path: FINES_FINANCE_BANKING_PATHS.root,
      redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
      pathMatch: 'full',
    },
  {
    path: `${FINES_FINANCE_BANKING_PATHS.children.inbound}/${FINES_FINANCE_BANKING_PATHS.children.search}`,

    loadComponent: () =>
      import('../fines-finance-inbound-files/fines-finance-inbound-files.component').then(
        (c) => c.FinesExtFinanceInboundFiles,
      ),
    //canActivate: [authGuard, routePermissionsGuard],
    data: {
      //routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: 'INBOUND FILES HERE',
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_FINANCE_BANKING_PATHS.children.outbound}/${FINES_FINANCE_BANKING_PATHS.children.search}`,

    loadComponent: () =>
      import('../fines-finance-outbound-files/fines-finance-outbound-files.component').then(
        (c) => c.FinesExtFinanceOutboundFiles,
      ),
    //canActivate: [authGuard, routePermissionsGuard],
    data: {
      //routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: 'OUTBOUND FILES HERE',
    },
    resolve: { title: TitleResolver },
  },
   {

    path: `${FINES_FINANCE_BANKING_PATHS.children.variantbankingfiles}/${FINES_FINANCE_BANKING_PATHS.children.upload}`,

    loadComponent: () =>
      import('../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component').then(
        (c) => c.FinesExtFinanceUploadVariantBankingFiles,
      ),
    //canActivate: [authGuard, routePermissionsGuard],
    data: {
      //routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: 'FILE UPLOAD HERE',
    },
    resolve: { title: TitleResolver },
  },
  
];
