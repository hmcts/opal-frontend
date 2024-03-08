import { TestBed } from '@angular/core/testing';
import { LaunchDarklyService } from './launch-darkly.service';
import { LDFlagChangeset, LDFlagSet } from 'launchdarkly-js-client-sdk';

describe('LaunchDarklyService', () => {
  let service: LaunchDarklyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchDarklyService);
  });

  it('should initialize LaunchDarkly flags', () => {
    service['storedLaunchDarklyClientId'] = '1234';
    service.initializeLaunchDarklyClient();

    const mockFlags = { flag1: true, flag2: false };
    spyOn(service['ldClient'], 'allFlags').and.returnValue(mockFlags);
    spyOn(service['stateService'].featureFlags, 'set');

    service['setLaunchDarklyFlags']();

    expect(service['ldClient'].allFlags).toHaveBeenCalled();
    expect(service['stateService'].featureFlags.set).toHaveBeenCalledWith(mockFlags);
  });

  it('should format the flag changeset correctly', () => {
    const flags: LDFlagChangeset = {
      flag1: { current: true, previous: false },
      flag2: { current: false, previous: true },
    };
    const expectedFormattedFlags: LDFlagSet = {
      flag1: true,
      flag2: false,
    };

    const formattedFlags = service['formatChangeFlags'](flags);
    expect(formattedFlags).toEqual(expectedFormattedFlags);
  });

  it('should return an empty object if the flags changeset is empty', () => {
    const flags: LDFlagChangeset = {};
    const formattedFlags = service['formatChangeFlags'](flags);
    expect(formattedFlags).toEqual({});
  });

  it('should initialize LaunchDarkly client', () => {
    service['storedLaunchDarklyClientId'] = '1234';
    service['initializeLaunchDarklyClient']();

    expect(service['ldClient']).toBeDefined();
  });

  it('should not initialize LaunchDarkly client', () => {
    service['storedLaunchDarklyClientId'] = null;

    service['initializeLaunchDarklyClient']();

    expect(service['ldClient']).not.toBeDefined();
  });

  it('should close the LaunchDarkly client', () => {
    service['storedLaunchDarklyClientId'] = '1234';
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
    // const mockFlags = { flag1: true, flag2: false };
    service['storedLaunchDarklyClientId'] = '1234';
    service.initializeLaunchDarklyClient();

    spyOn(service['ldClient'], 'waitForInitialization').and.returnValue(Promise.resolve());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'setLaunchDarklyFlags');

    await service.initializeLaunchDarklyFlags();

    expect(service['ldClient'].waitForInitialization).toHaveBeenCalled();
    expect(service['setLaunchDarklyFlags']).toHaveBeenCalled();
  });

  it('should throw an error when waitForInitialization fails', async () => {
    service['storedLaunchDarklyClientId'] = '1234';
    service.initializeLaunchDarklyClient();

    const error = new Error('Initialization failed');
    spyOn(service['ldClient'], 'waitForInitialization').and.returnValue(Promise.reject(error));

    await expectAsync(service.initializeLaunchDarklyFlags()).toBeRejectedWith(error);
  });

  it('should initialize LaunchDarkly change listener when ldClient is defined', () => {
    service['storedLaunchDarklyClientId'] = '1234';
    service.initializeLaunchDarklyClient();

    spyOn(service['ldClient'], 'on');

    service.initializeLaunchDarklyChangeListener();

    expect(service['ldClient'].on).toHaveBeenCalledWith('change', jasmine.any(Function));
  });

  it('should update feature flags when ldClient emits change event', () => {
    service['storedLaunchDarklyClientId'] = '1234';
    service.initializeLaunchDarklyClient();

    const mockFlags: LDFlagChangeset = {
      flag1: { current: true, previous: false },
      flag2: { current: false, previous: true },
    };
    const expectedUpdatedFlags = {
      flag1: true,
      flag2: false,
    };

    // eslint-disable-next-line @typescript-eslint/ban-types
    spyOn(service['ldClient'], 'on').and.callFake((event: string, callback: Function) => {
      if (event === 'change') {
        callback(mockFlags);
      }
    });
    spyOn(service['stateService'].featureFlags, 'set');

    service.initializeLaunchDarklyChangeListener();

    expect(service['stateService'].featureFlags.set).toHaveBeenCalledWith(expectedUpdatedFlags);
  });
});
