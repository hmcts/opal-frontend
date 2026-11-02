import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS } from './constants/fines-acc-alternate-payment-reference-routing-paths.constant';
import { alternatePaymentReferencePageRoute } from './fines-acc-alternate-payment-reference-page-route';

export const routing: Routes = [
  alternatePaymentReferencePageRoute(
    FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS.children.list,
    'Manage Alternate Payment References',
    () =>
      import('../fines-acc-defendant-alternate-payment-reference-list/fines-acc-defendant-alternate-payment-reference-list.component').then(
        (c) => c.FinesAccDefendantAlternatePaymentReferenceListComponent,
      ),
  ),
  alternatePaymentReferencePageRoute(
    FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS.children.delete,
    'Remove Alternate Payment Reference',
    () =>
      import('../fines-acc-defendant-alternate-payment-reference-delete/fines-acc-defendant-alternate-payment-reference-delete.component').then(
        (c) => c.FinesAccDefendantAlternatePaymentReferenceDeleteComponent,
      ),
  ),
  {
    path: FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS.children.denied,
    loadComponent: () =>
      import('../fines-acc-defendant-alternate-payment-reference-access-denied/fines-acc-defendant-alternate-payment-reference-access-denied.component').then(
        (c) => c.FinesAccDefendantAlternatePaymentReferenceAccessDeniedComponent,
      ),
    data: { title: 'Access Denied' },
    resolve: { title: TitleResolver },
  },
];
