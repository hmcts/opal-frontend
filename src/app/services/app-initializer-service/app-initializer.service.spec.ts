import { TestBed } from '@angular/core/testing';

import { AppInitializerService } from './app-initializer.service';

describe('AppInitializerService', () => {
  let service: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize user state', () => {
    spyOn(service['userStateService'], 'initializeUserState');
    service['initializeUserState']();
    expect(service['userStateService'].initializeUserState).toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly', async () => {
    spyOn(service['launchDarklyService'], 'initializeLaunchDarklyClient');
    spyOn(service['launchDarklyService'], 'initializeLaunchDarklyChangeListener');

    service['initializeLaunchDarkly']();

    expect(service['launchDarklyService'].initializeLaunchDarklyClient).toHaveBeenCalled();
    expect(service['launchDarklyService'].initializeLaunchDarklyChangeListener).toHaveBeenCalled();
  });

  it('should initialize the app', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'initializeUserState');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'initializeLaunchDarkly').and.returnValue(Promise.resolve());
    spyOn(service['launchDarklyService'], 'initializeLaunchDarklyFlags').and.returnValue(Promise.resolve());

    await service.initializeApp();

    expect(service['initializeUserState']).toHaveBeenCalled();
    expect(service['initializeLaunchDarkly']).toHaveBeenCalled();
    expect(service['launchDarklyService'].initializeLaunchDarklyFlags).toHaveBeenCalled();
  });
});
