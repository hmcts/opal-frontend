import { TestBed } from '@angular/core/testing';
import { LaunchDarklyService } from './launch-darkly.service';
import { LDFlagChangeset, LDFlagSet } from 'launchdarkly-js-client-sdk';

fdescribe('LaunchDarklyService', () => {
  let service: LaunchDarklyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaunchDarklyService);
  });

  it('should initialize LaunchDarkly flags', () => {
    service['initializeLaunchDarklyClient']('1234');

    const mockFlags = { flag1: true, flag2: false };
    spyOn(service['ldClient'], 'allFlags').and.returnValue(mockFlags);
    spyOn(service['stateService'].featureFlags, 'set');

    service['initializeLaunchDarklyFlags']();

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

  it('should initialize LaunchDarkly client with anonymous flag', () => {
    const clientId = '1234';

    spyOn<any>(service, 'initializeLaunchDarklyReadyListener');
    spyOn<any>(service, 'initializeLaunchDarklyChangeListener');

    service['initializeLaunchDarklyClient'](clientId);

    expect(service['ldClient']).not.toBeNull();
    expect(service['initializeLaunchDarklyReadyListener']).toHaveBeenCalled();
    expect(service['initializeLaunchDarklyChangeListener']).toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly', () => {
    const clientId = '1234';
    spyOn<any>(service, 'initializeLaunchDarklyClient');

    service['storedLaunchDarklyClientId'] = clientId;
    service.initializeLaunchDarkly();

    expect(service['initializeLaunchDarklyClient']).toHaveBeenCalledWith(clientId);
  });

  it('should not initialize LaunchDarkly if clientId is not stored', () => {
    spyOn<any>(service, 'initializeLaunchDarklyClient');

    service['storedLaunchDarklyClientId'] = null;
    service.initializeLaunchDarkly();

    expect(service['initializeLaunchDarklyClient']).not.toHaveBeenCalled();
  });
});
