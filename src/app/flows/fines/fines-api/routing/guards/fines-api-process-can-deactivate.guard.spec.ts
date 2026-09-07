import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from '@hmcts/opal-frontend-common/guards/can-deactivate/interfaces';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { finesApiProcessCanDeactivateGuard } from './fines-api-process-can-deactivate.guard';

describe('finesApiProcessCanDeactivateGuard', () => {
  const currentRoute = {} as ActivatedRouteSnapshot;
  const currentState = { url: '/fines/auto-payment-in/process-allocate' } as RouterStateSnapshot;
  let confirmSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    confirmSpy = vi.fn().mockReturnValue(false);
    vi.stubGlobal('confirm', confirmSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const runGuard = (componentCanDeactivate: boolean, nextUrl: string) => {
    const component: ICanDeactivateCanComponentDeactivate = {
      canDeactivate: () => componentCanDeactivate,
    };

    return finesApiProcessCanDeactivateGuard(component, currentRoute, currentState, {
      url: nextUrl,
    } as RouterStateSnapshot);
  };

  it('should display the common warning for guarded navigation within Automatic Cash Input', () => {
    expect(runGuard(false, '/fines/auto-payment-in/select-business-units')).toBe(false);
    expect(confirmSpy).toHaveBeenCalledWith(
      'WARNING: Are you sure you want to leave this page? Any information you entered will be lost.',
    );
  });

  it('should allow intended navigation to Confirm Process', () => {
    expect(runGuard(false, '/fines/auto-payment-in/confirm-process')).toBe(true);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('should defer navigation outside Automatic Cash Input to the parent shell guard', () => {
    expect(runGuard(false, '/fines/dashboard/finance')).toBe(true);
    expect(confirmSpy).not.toHaveBeenCalled();
  });
});
