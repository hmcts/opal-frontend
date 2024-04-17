import { TestBed } from '@angular/core/testing';

import { AppInitializerService } from './app-initializer.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppInitializerService', () => {
  let service: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AppInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize LaunchDarkly', () => {
    spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');

    service['initializeLaunchDarkly']();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
  });

  it('should initialize SSO enabled', () => {
    spyOn(service['transferStateService'], 'initializeSsoEnabled');
    service['initializeSsoEnabled']();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
  });

  it('should initialize the app', () => {
    spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');
    spyOn(service['transferStateService'], 'initializeSsoEnabled');

    service.initializeApp();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
  });
});
