import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_FINANCE_ROUTING_PATHS } from './fines-finance-routing-paths.constant';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { featureFlagRedirectGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';

const financeRootPermissionIds = FINES_PERMISSIONS;

export const release1cBankingInterfacesFeatureFlagGuard = featureFlagRedirectGuard(
  RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG,
);

export const routing: Routes = [
  {
    path: '',
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: `${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,

    loadComponent: () =>
      import('../fines-finance-inbound-files/fines-finance-inbound-files.component').then(
        (c) => c.FinesFinanceInboundFilesComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, release1cBankingInterfacesFeatureFlagGuard],
    data: {
      routePermissionId: [financeRootPermissionIds['view-interface-files']],
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_FINANCE_ROUTING_PATHS.children.outbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,

    loadComponent: () =>
      import('../fines-finance-outbound-files/fines-finance-outbound-files.component').then(
        (c) => c.FinesFinanceOutboundFilesComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, release1cBankingInterfacesFeatureFlagGuard],
    data: {
      routePermissionId: [financeRootPermissionIds['view-interface-files']],
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,

    loadComponent: () =>
      import('../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component').then(
        (c) => c.FinesFinanceUploadVariantBankingFilesComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, release1cBankingInterfacesFeatureFlagGuard],
    data: {
      routePermissionId: [financeRootPermissionIds['create-interface-files']],
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
    },
    resolve: { title: TitleResolver },
  },
];
