import { TestBed } from '@angular/core/testing';
import { AppInitializerService } from './app-initializer.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { ISessionTokenExpiry } from '@services/session-service/interfaces/session-token-expiry.interface';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@services/session-service/mocks/session-token-expiry.mock';

const tokenExpiry: ISessionTokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;

describe('AppInitializerService', () => {
  let service: AppInitializerService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppInitializerService);
  });

  afterAll(() => {
    service = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize LaunchDarkly', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');

    service['initializeLaunchDarkly']();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
  });

  it('should initialize SSO enabled', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(service['transferStateService'], 'initializeSsoEnabled');
    service['initializeSsoEnabled']();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
  });

  it('should initialize the session timeout', async () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(service['sessionService'], 'getTokenExpiry').and.returnValue(of(tokenExpiry));
    await service['initializeSessionTimeout']();
    expect(service['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should initialize the SSO enabled, LaunchDarkly, and session timeout', async () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');
    spyOn(service['transferStateService'], 'initializeSsoEnabled');
    spyOn(service['sessionService'], 'getTokenExpiry').and.returnValue(of(tokenExpiry));

    await service.initializeApp();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
    expect(service['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });
});
