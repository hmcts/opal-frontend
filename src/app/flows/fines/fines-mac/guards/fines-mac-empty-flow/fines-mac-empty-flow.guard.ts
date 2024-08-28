import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { FinesService } from '@services/fines';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants';
import { FINES_ROUTING_PATHS } from '@constants/fines';

export const finesMacEmptyFlowGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const finesService = inject(FinesService);

  const { accountDetails } = finesService.finesMacState;
  const isFinesMacPopulated = accountDetails.AccountType && accountDetails.DefendantType;

  if (!isFinesMacPopulated) {
    const urlTree = router.createUrlTree(
      [
        `${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.mac.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
      ],
      {
        queryParams: route.queryParams,
        fragment: route.fragment ?? undefined,
      },
    );
    return urlTree;
  }

  return true;
};
