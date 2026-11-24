import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
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

/** Resolves payment-details history exits before leave guards run, so the warning is shown only once. */
export const finesMciCriminalCheckPaymentHistoryGuard: CanMatchFn = () => {
  const store = inject(FinesMciStore);
  const router = inject(Router);
  const account = store.selectedCriminalAccount();
  if (!account || router.currentNavigation()?.trigger !== 'popstate') return true;

  const criminalPath = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.payment,
    FINES_MCI_ROUTING_PATHS.children.category,
    FINES_MCI_ROUTING_PATHS.children.criminal,
  ];
  const paymentDetailsUrl = router
    .createUrlTree([...criminalPath, FINES_MCI_ROUTING_PATHS.children.paymentDetails, account.defendant_account_id])
    .toString();
  if (router.url.split(/[?#]/)[0] !== paymentDetailsUrl) return true;

  return router.createUrlTree([
    ...criminalPath,
    FINES_MCI_ROUTING_PATHS.children.account,
    account.defendant_account_id,
    account.organisation_flag ? 'company' : 'individual',
  ]);
};
