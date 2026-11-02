import { Route } from '@angular/router';
import { businessUnitRoutePermissionsGuard } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { alternatePaymentReferencesResolver } from '../fines-acc-defendant-alternate-payment-reference/fines-acc-alternate-payment-references.resolver';
import { FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS } from './constants/fines-acc-alternate-payment-reference-routing-paths.constant';

/** Applies the same account permission and fresh versioned data to each APR management page. */
export const alternatePaymentReferencePageRoute = (
  path: string,
  title: string,
  loadComponent: Route['loadComponent'],
): Route => ({
  path,
  loadComponent,
  canActivate: [businessUnitRoutePermissionsGuard],
  runGuardsAndResolvers: 'always',
  data: {
    title,
    routePermissionId: [FINES_PERMISSIONS['manage-alternate-payment-references']],
    accessDeniedPath: FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS.children.denied,
  },
  resolve: { title: TitleResolver, alternatePaymentReferences: alternatePaymentReferencesResolver },
});
