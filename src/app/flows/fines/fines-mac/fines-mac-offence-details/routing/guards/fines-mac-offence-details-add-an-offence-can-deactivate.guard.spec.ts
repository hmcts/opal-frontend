import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { finesMacOffenceDetailsAddAnOffenceCanDeactivateGuard } from './fines-mac-offence-details-add-an-offence-can-deactivate.guard';

describe('finesMacOffenceDetailsAddAnOffenceCanDeactivateGuard', () => {
  const component = { canDeactivate: vi.fn() };
  const currentRoute = {} as ActivatedRouteSnapshot;
  const currentState = {} as RouterStateSnapshot;

  beforeEach(() => {
    component.canDeactivate.mockReset();
  });

  it('allows navigation to the minor creditor form without an unsaved changes warning', () => {
    const nextState = { url: '/fines/mac/offence-details/add-minor-creditor' } as RouterStateSnapshot;

    const result = finesMacOffenceDetailsAddAnOffenceCanDeactivateGuard(
      component,
      currentRoute,
      currentState,
      nextState,
    );

    expect(result).toBe(true);
    expect(component.canDeactivate).not.toHaveBeenCalled();
  });

  it('uses the shared unsaved changes guard when leaving the offence form', () => {
    component.canDeactivate.mockReturnValue(false);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const nextState = { url: '/fines/mac/offence-details/review-offences' } as RouterStateSnapshot;

    const result = finesMacOffenceDetailsAddAnOffenceCanDeactivateGuard(
      component,
      currentRoute,
      currentState,
      nextState,
    );

    expect(result).toBe(false);
    expect(component.canDeactivate).toHaveBeenCalled();
    expect(confirmSpy).toHaveBeenCalled();
  });
});
