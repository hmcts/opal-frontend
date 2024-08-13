import { TestBed } from '@angular/core/testing';
import { AppInitializerService } from './app-initializer.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { ISessionTokenExpiry } from '@interfaces';
import { TOKEN_EXPIRY_MOCK } from '@mocks';

const tokenExpiry: ISessionTokenExpiry = TOKEN_EXPIRY_MOCK;

describe('AppInitializerService', () => {
  let service: AppInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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

  it('should initialize the session timeout', async () => {
    spyOn(service['sessionService'], 'getTokenExpiry').and.returnValue(of(tokenExpiry));
    await service['initializeSessionTimeout']();
    expect(service['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should initialize the SSO enabled, LaunchDarkly, and session timeout', async () => {
    spyOn(service['transferStateService'], 'initializeLaunchDarklyConfig');
    spyOn(service['transferStateService'], 'initializeSsoEnabled');
    spyOn(service['sessionService'], 'getTokenExpiry').and.returnValue(of(tokenExpiry));

    await service.initializeApp();

    expect(service['transferStateService'].initializeLaunchDarklyConfig).toHaveBeenCalled();
    expect(service['transferStateService'].initializeSsoEnabled).toHaveBeenCalled();
    expect(service['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });
});
