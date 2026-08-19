import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_FINANCE_BANKING_PATHS } from '../../constants/fines-finance.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';

const draftRootPermissionIds = FINES_PERMISSIONS;

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
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['view-interface-files']],
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_FINANCE_BANKING_PATHS.children.outbound}/${FINES_FINANCE_BANKING_PATHS.children.search}`,

    loadComponent: () =>
      import('../fines-finance-outbound-files/fines-finance-outbound-files.component').then(
        (c) => c.FinesExtFinanceOutboundFiles,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['create-interface-files']],
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_FINANCE_BANKING_PATHS.children.variantbankingfiles}/${FINES_FINANCE_BANKING_PATHS.children.upload}`,

    loadComponent: () =>
      import('../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component').then(
        (c) => c.FinesExtFinanceUploadVariantBankingFiles,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [draftRootPermissionIds['upload-variant-banking-files']],
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
    },
    resolve: { title: TitleResolver },
  },
];
