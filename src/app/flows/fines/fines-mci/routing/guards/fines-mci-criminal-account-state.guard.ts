import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FINES_MCI_ROUTING_PATHS } from '../constants/fines-mci-routing-paths.constant';

/** Returns stale account history entries to Till Details after criminal payment state has been discarded, before leave guards run. */
export const finesMciCriminalAccountStateGuard: CanMatchFn = (route, segments) => {
  const account = inject(FinesMciStore).selectedCriminalAccount();
  const accountIdIndex = route.path?.split('/').indexOf(':accountId') ?? -1;
  if (account && String(account.defendant_account_id) === segments[accountIdIndex]?.path) {
    return true;
  }

  return inject(Router).createUrlTree([
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
    FINES_MCI_ROUTING_PATHS.children.details,
  ]);
};
