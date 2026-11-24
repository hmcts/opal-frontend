import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FINES_MCI_ROUTING_PATHS } from '../constants/fines-mci-routing-paths.constant';

/** Requires a saved payment and selected account before displaying the criminal payment summary. */
export const finesMciCriminalCheckPaymentGuard: CanActivateFn = () => {
  const store = inject(FinesMciStore);
  const account = store.selectedCriminalAccount();
  if (account && store.criminalPayment()) return true;

  return inject(Router).createUrlTree([
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.payment,
    FINES_MCI_ROUTING_PATHS.children.category,
    FINES_MCI_ROUTING_PATHS.children.criminal,
    ...(account
      ? [FINES_MCI_ROUTING_PATHS.children.paymentDetails, account.defendant_account_id]
      : [FINES_MCI_ROUTING_PATHS.children.search]),
  ]);
};
