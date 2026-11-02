import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bankingInterfacesFeatureFlagGuard } from './fines-acc-alternate-payment-reference-feature-flag.guard';

describe('bankingInterfacesFeatureFlagGuard', () => {
  let featureFlags: Record<string, boolean>;

  beforeEach(() => {
    featureFlags = {};
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: GlobalStore, useValue: { featureFlags: () => featureFlags } },
        {
          provide: LaunchDarklyService,
          useValue: { initializeLaunchDarklyFlags: vi.fn(), initializeLaunchDarklyClient: vi.fn() },
        },
      ],
    });
  });

  it.each([false, undefined])(
    'should return to the current account payment terms when the flag is %s',
    async (enabled) => {
      if (enabled !== undefined) featureFlags['release-1c-banking-interfaces'] = enabled;
      const route = { paramMap: convertToParamMap({ accountId: '123' }) } as ActivatedRouteSnapshot;

      const result = await TestBed.runInInjectionContext(() =>
        bankingInterfacesFeatureFlagGuard(route, {} as RouterStateSnapshot),
      );

      expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe(
        '/fines/account/defendant/123/details#payment-terms',
      );
    },
  );

  it('should allow the APR journey when banking interfaces is enabled', async () => {
    featureFlags['release-1c-banking-interfaces'] = true;
    const route = { paramMap: convertToParamMap({ accountId: '123' }) } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      bankingInterfacesFeatureFlagGuard(route, {} as RouterStateSnapshot),
    );

    expect(result).toBe(true);
  });
});
