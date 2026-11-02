import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { resolveFeatureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG } from '../../../constants/release-feature-flags.constant';
import { FINES_ACC_ROUTING_PATHS } from '../constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS } from '../../fines-acc-defendant-details/constants/fines-acc-defendant-details-tabs-keys.constant';

export const finesAccAprFeatureFlagGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  if (await resolveFeatureFlagGuard(RELEASE_1C_BANKING_INTERFACES_FEATURE_FLAG, route, state)) {
    return true;
  }

  return router.createUrlTree(
    [
      `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}`,
      route.paramMap.get('accountId'),
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ],
    { fragment: FINES_ACC_DEFENDANT_DETAILS_TABS_KEYS['payment-terms'] },
  );
};
