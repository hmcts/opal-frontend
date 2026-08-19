import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { describe, expect, it } from 'vitest';
import { FINES_FINANCE_ROUTING_PATHS } from '../../constants/fines-finance.constant';
import { FinesFinanceInboundFilesComponent } from '../fines-finance-inbound-files/fines-finance-inbound-files.component';
import { FinesFinanceOutboundFilesComponent } from '../fines-finance-outbound-files/fines-finance-outbound-files.component';
import { FinesFinanceUploadVariantBankingFilesComponent } from '../fines-finance-upload-variant-banking-files/fines-finance-upload-variant-banking-files.component';
import { FINES_FINANCE_ROUTING_TITLES } from './constants/fines-finance-routing-titles.constant';
import { routing } from './fines-finance.routes';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';

describe('fines finance routes', () => {
  it('should redirect the Finance root to the dashboard', () => {
    const rootRoute = routing.find((route) => route.path === FINES_FINANCE_ROUTING_PATHS.root);

    expect(rootRoute?.redirectTo).toBe(PAGES_ROUTING_PATHS.children.dashboard);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it.each([
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.inbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.inbound,
      routePermissionId: FINES_PERMISSIONS['view-interface-files'],
      component: FinesFinanceInboundFilesComponent,
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.outbound}/${FINES_FINANCE_ROUTING_PATHS.children.search}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.outbound,
      routePermissionId: FINES_PERMISSIONS['create-interface-files'],
      component: FinesFinanceOutboundFilesComponent,
    },
    {
      path: `${FINES_FINANCE_ROUTING_PATHS.children.variantBankingFiles}/${FINES_FINANCE_ROUTING_PATHS.children.upload}`,
      title: FINES_FINANCE_ROUTING_TITLES.children.upload,
      routePermissionId: FINES_PERMISSIONS['upload-variant-banking-files'],
      component: FinesFinanceUploadVariantBankingFilesComponent,
    },
  ])('should title and lazy-load the $title route', async ({ path, title, routePermissionId, component }) => {
    const route = routing.find((routeItem) => routeItem.path === path);

    expect(route?.data).toEqual({ title, routePermissionId: [routePermissionId] });
    expect(route?.resolve).toEqual({ title: TitleResolver });
    await expect(route?.loadComponent?.()).resolves.toBe(component);
  });
});
