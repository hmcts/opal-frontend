import { TestBed } from '@angular/core/testing';

import { AppInitializerService } from './app-initializer.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { USER_STATE_MOCK } from '@mocks';
import { of } from 'rxjs';

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

  it('should initialize user state', async () => {
    spyOn(service['sessionService'], 'getUserState').and.returnValue(of(USER_STATE_MOCK));

    await service['initializeUserState']();

    expect(service['sessionService'].getUserState).toHaveBeenCalled();
  });

  it('should initialize LaunchDarkly', async () => {
    spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');

    service['initializeLaunchDarkly']();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
  });

  it('should initialize the app', async () => {
    spyOn(service['sessionService'], 'getUserState').and.returnValue(of(USER_STATE_MOCK));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(service, 'initializeUserState');

    await service.initializeApp();

    expect(service['initializeUserState']).toHaveBeenCalled();
  });

  it('should initialize SSO enabled', () => {
    spyOn(service['transferStateService'], 'initializeSsoEnabled');
    service['initializeSsoEnabled']();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
  });
});
