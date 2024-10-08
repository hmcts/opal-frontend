import { TestBed } from '@angular/core/testing';
import { LaunchDarklyService } from './launch-darkly.service';
import { LDFlagChangeset, LDFlagSet } from 'launchdarkly-js-client-sdk';
import { LAUNCH_DARKLY_CHANGE_FLAGS_MOCK } from '@services/launch-darkly/mocks/launch-darkly-change-flags.mock';
import { LAUNCH_DARKLY_FLAGS_MOCK } from '@services/launch-darkly/mocks/launch-darkly-flags.mock';
import { GlobalStateService } from '@services/global-state-service/global-state.service';

describe('LaunchDarklyService', () => {
  let service: LaunchDarklyService;
  let globalStateService: GlobalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchDarklyService);
    globalStateService = TestBed.inject(GlobalStateService);

    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: true,
    };
  });

  it('should initialize LaunchDarkly flags', () => {
    service.initializeLaunchDarklyClient();

    const mockFlags: LDFlagSet = LAUNCH_DARKLY_FLAGS_MOCK;
    spyOn(service['ldClient'], 'allFlags').and.returnValue(mockFlags);
    spyOn(service['globalStateService'].featureFlags, 'set');

    service['setLaunchDarklyFlags']();

    expect(service['ldClient'].allFlags).toHaveBeenCalled();
    expect(service['globalStateService'].featureFlags.set).toHaveBeenCalledWith(mockFlags);
  });

  it('should format the flag changeset correctly', () => {
    const flags: LDFlagChangeset = LAUNCH_DARKLY_CHANGE_FLAGS_MOCK;
    const expectedFormattedFlags: LDFlagSet = LAUNCH_DARKLY_FLAGS_MOCK;

    const formattedFlags = service['formatChangeFlags'](flags);
    expect(formattedFlags).toEqual(expectedFormattedFlags);
  });

  it('should return an empty object if the flags changeset is empty', () => {
    const flags: LDFlagChangeset = {};
    const formattedFlags = service['formatChangeFlags'](flags);
    expect(formattedFlags).toEqual({});
  });

  it('should initialize LaunchDarkly client', () => {
    service['initializeLaunchDarklyClient']();

    expect(service['ldClient']).toBeDefined();
  });

  it('should not initialize LaunchDarkly client if no client id', () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: null,
      stream: true,
    };

    service['initializeLaunchDarklyClient']();

    expect(service['ldClient']).not.toBeDefined();
  });

  it('should not initialize LaunchDarkly client if not enabled', () => {
    globalStateService.launchDarklyConfig = {
      enabled: false,
      clientId: '1234',
      stream: false,
    };

    service['initializeLaunchDarklyClient']();

    expect(service['ldClient']).not.toBeDefined();
  });

  it('should not initialize LaunchDarkly client if not enabled and no client id', () => {
    globalStateService.launchDarklyConfig = {
      enabled: false,
      clientId: null,
      stream: false,
    };

    service['initializeLaunchDarklyClient']();

    expect(service['ldClient']).not.toBeDefined();
  });

  it('should close the LaunchDarkly client', () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: false,
    };

    service.initializeLaunchDarklyClient();
    spyOn(service['ldClient'], 'close');
    service['closeLaunchDarklyClient']();
    expect(service['ldClient'].close).toHaveBeenCalled();
  });

  it('should call closeLaunchDarklyClient on ngOnDestroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'closeLaunchDarklyClient');
    service.ngOnDestroy();
    expect(service['closeLaunchDarklyClient']).toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly flags when ldClient is not defined', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'setLaunchDarklyFlags');

    await service.initializeLaunchDarklyFlags();

    expect(service['setLaunchDarklyFlags']).not.toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly flags when ldClient is defined', async () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: false,
    };

    service.initializeLaunchDarklyClient();

    spyOn(service['ldClient'], 'waitForInitialization').and.returnValue(Promise.resolve());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'setLaunchDarklyFlags');

    await service.initializeLaunchDarklyFlags();

    expect(service['ldClient'].waitForInitialization).toHaveBeenCalled();
    expect(service['setLaunchDarklyFlags']).toHaveBeenCalled();
  });

  it('should throw an error when waitForInitialization fails', async () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: false,
    };

    service.initializeLaunchDarklyClient();

    const error = new Error('Initialization failed');
    spyOn(service['ldClient'], 'waitForInitialization').and.returnValue(Promise.reject(error));

    await expectAsync(service.initializeLaunchDarklyFlags()).toBeRejectedWith(error);
  });

  it('should initialize LaunchDarkly change listener when ldClient is defined', () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: true,
    };
    service.initializeLaunchDarklyClient();

    spyOn(service['ldClient'], 'on');

    service.initializeLaunchDarklyChangeListener();

    expect(service['ldClient'].on).toHaveBeenCalledWith('change', jasmine.any(Function));
  });

  it('should not initialize LaunchDarkly change listener when stream is false', () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: false,
    };
    service.initializeLaunchDarklyClient();

    spyOn(service['ldClient'], 'on');

    service.initializeLaunchDarklyChangeListener();

    expect(service['ldClient'].on).not.toHaveBeenCalledWith('change', jasmine.any(Function));
  });

  it('should update feature flags when ldClient emits change event', () => {
    globalStateService.launchDarklyConfig = {
      enabled: true,
      clientId: '1234',
      stream: true,
    };

    service.initializeLaunchDarklyClient();

    const mockFlags: LDFlagChangeset = LAUNCH_DARKLY_CHANGE_FLAGS_MOCK;
    const expectedUpdatedFlags = LAUNCH_DARKLY_FLAGS_MOCK;

    spyOn(service['ldClient'], 'on').and.callFake((event: string, callback: (flags: LDFlagChangeset) => void) => {
      if (event === 'change') {
        callback(mockFlags);
      }
    });

    spyOn(service['globalStateService'].featureFlags, 'set');

    service.initializeLaunchDarklyChangeListener();

    expect(service['globalStateService'].featureFlags.set).toHaveBeenCalledWith(expectedUpdatedFlags);
  });
});
