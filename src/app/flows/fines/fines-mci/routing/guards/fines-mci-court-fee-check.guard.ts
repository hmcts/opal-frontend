import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from '../constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

/** Requires both saved court fee and payment details before opening the temporary check screen. */
export const finesMciCourtFeeCheckGuard: CanActivateFn = () => {
  const store = inject(FinesMciStore);
  if (store.courtFeeDraft() && store.courtFeePaymentDetails()) return true;
  return inject(Router).createUrlTree([
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.courtFeeDetails,
  ]);
};
