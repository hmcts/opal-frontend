import { TestBed } from '@angular/core/testing';
import { APP_MODE_FEATURE_FLAG } from '@app/flows/fines/constants/environment-feature-flags.constant';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveAppMode } from './resolve-app-mode.helper';

describe('resolveAppMode', () => {
  let featureFlags: Record<string, unknown>;
  let launchDarklyService: {
    initializeLaunchDarklyFlags: ReturnType<typeof vi.fn>;
    initializeLaunchDarklyClient: ReturnType<typeof vi.fn>;
  };

  const runHelper = () => TestBed.runInInjectionContext(() => resolveAppMode());

  beforeEach(() => {
    featureFlags = {};
    launchDarklyService = {
      initializeLaunchDarklyFlags: vi.fn().mockResolvedValue(undefined),
      initializeLaunchDarklyClient: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalStore, useValue: { featureFlags: () => featureFlags } },
        { provide: LaunchDarklyService, useValue: launchDarklyService },
      ],
    });
  });

  it.each(['legacy', 'opal'] as const)('should use the cached %s mode without initializing flags', async (mode) => {
    featureFlags = { [APP_MODE_FEATURE_FLAG]: mode };

    await expect(runHelper()).resolves.toBe(mode);

    expect(launchDarklyService.initializeLaunchDarklyFlags).not.toHaveBeenCalled();
    expect(launchDarklyService.initializeLaunchDarklyClient).not.toHaveBeenCalled();
  });

  it('should wait for flag initialization before resolving Opal mode', async () => {
    let completeInitialization!: () => void;
    launchDarklyService.initializeLaunchDarklyFlags.mockReturnValue(
      new Promise<void>((resolve) => {
        completeInitialization = resolve;
      }),
    );

    const result = runHelper();
    featureFlags = { [APP_MODE_FEATURE_FLAG]: 'opal' };
    completeInitialization();

    await expect(result).resolves.toBe('opal');
    expect(launchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalledTimes(1);
    expect(launchDarklyService.initializeLaunchDarklyClient).not.toHaveBeenCalled();
  });

  it('should initialize the client and reload flags when the mode is still missing', async () => {
    launchDarklyService.initializeLaunchDarklyFlags
      .mockResolvedValueOnce(undefined)
      .mockImplementationOnce(async () => {
        featureFlags = { [APP_MODE_FEATURE_FLAG]: 'opal' };
      });

    await expect(runHelper()).resolves.toBe('opal');

    expect(launchDarklyService.initializeLaunchDarklyClient).toHaveBeenCalledTimes(1);
    expect(launchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalledTimes(2);
  });

  it('should retain legacy mode when initialization does not provide an app mode', async () => {
    await expect(runHelper()).resolves.toBe('legacy');

    expect(launchDarklyService.initializeLaunchDarklyClient).toHaveBeenCalledTimes(1);
    expect(launchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalledTimes(2);
  });

  it.each([null, 'unknown', 'OPAL', ' opal ', true, false, 1, {}])(
    'should retain legacy mode for invalid cached app mode %j',
    async (mode) => {
      featureFlags = { [APP_MODE_FEATURE_FLAG]: mode };

      await expect(runHelper()).resolves.toBe('legacy');

      expect(launchDarklyService.initializeLaunchDarklyFlags).not.toHaveBeenCalled();
      expect(launchDarklyService.initializeLaunchDarklyClient).not.toHaveBeenCalled();
    },
  );

  it.each([1, 2])('should retain legacy mode when initialization attempt %i fails', async (attempt) => {
    if (attempt === 2) {
      launchDarklyService.initializeLaunchDarklyFlags.mockResolvedValueOnce(undefined);
    }
    launchDarklyService.initializeLaunchDarklyFlags.mockRejectedValueOnce(new Error('Flag initialization failed'));

    await expect(runHelper()).resolves.toBe('legacy');

    expect(launchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalledTimes(attempt);
    expect(launchDarklyService.initializeLaunchDarklyClient).toHaveBeenCalledTimes(attempt - 1);
  });

  it('should retain legacy mode when client initialization fails', async () => {
    launchDarklyService.initializeLaunchDarklyClient.mockImplementation(() => {
      throw new Error('Client initialization failed');
    });

    await expect(runHelper()).resolves.toBe('legacy');

    expect(launchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalledTimes(1);
  });
});
