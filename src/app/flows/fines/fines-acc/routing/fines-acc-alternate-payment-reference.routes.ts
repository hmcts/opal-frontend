import { Routes } from '@angular/router';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_ACC_ALTERNATE_PAYMENT_REFERENCE_ROUTING_PATHS } from './constants/fines-acc-alternate-payment-reference-routing-paths.constant';

export const routing: Routes = [
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
