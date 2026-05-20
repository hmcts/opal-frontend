import { ActivatedRouteSnapshot, type GuardResult, type MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { featureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { firstValueFrom, isObservable } from 'rxjs';

const resolveGuardResult = (result: MaybeAsync<GuardResult>): Promise<GuardResult> =>
  isObservable(result) ? firstValueFrom(result) : Promise.resolve(result);

export const resolveFeatureFlagGuard = async (
  flagKey: string,
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> => (await resolveGuardResult(featureFlagGuard(flagKey)(route, state))) === true;
