import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FinesMciStore } from '../../stores/fines-mci.store';

/** Requires the confirmed account and its balance before accepting payment details. */
export const finesMciCriminalPaymentAccountGuard: CanActivateFn = (route, state) => {
  const store = inject(FinesMciStore);
  const balance =
    store.selectedCriminalAccountAtAGlance()?.account_balance ??
    store.selectedCriminalAccountHeader()?.payment_state_summary.account_balance;
  if (
    String(store.selectedCriminalAccount()?.defendant_account_id) === route.paramMap.get('accountId') &&
    store.selectedCriminalAccountAtAGlance() &&
    typeof balance === 'number' &&
    Number.isFinite(balance)
  ) {
    return true;
  }
  return inject(Router).parseUrl(`${state.url.split('/payment-details/')[0]}/search`);
};
