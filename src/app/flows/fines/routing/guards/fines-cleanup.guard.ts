import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesMacStore } from '../../fines-mac/stores/fines-mac.store';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { FinesSaStore } from '../../fines-sa/stores/fines-sa.store';
import { FinesAccountStore } from '../../fines-acc/stores/fines-acc.store';

/**
 * Guard that clears fines-related caches and stores when navigating away from the fines area.
 */
export const finesCleanupGuard: CanDeactivateFn<unknown> = () => {
  const opalFines = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);
  const finesDraftStore = inject(FinesDraftStore);
  const finesSaStore = inject(FinesSaStore);
  const finesAccountStore = inject(FinesAccountStore);

  opalFines.clearAllCaches();
  finesMacStore.resetFinesMacStore();
  finesDraftStore.resetFineDraftState();
  finesDraftStore.resetFragmentAndAmend();
  finesDraftStore.resetFragmentAndChecker();
  finesDraftStore.resetBannerMessage();
  finesSaStore.resetStore();
  finesAccountStore.clearAccountState();
  finesAccountStore.clearSuccessMessage();

  return true;
};
