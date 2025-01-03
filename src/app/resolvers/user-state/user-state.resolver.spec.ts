import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, UrlSegment } from '@angular/router';

import { userStateResolver } from './user-state.resolver';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';
import { of } from 'rxjs';

import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { SessionService } from '@services/session-service/session.service';

describe('userStateResolver', () => {
  const executeResolver: ResolveFn<ISessionUserState> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userStateResolver(...resolverParameters));
  let mockSessionService: jasmine.SpyObj<SessionService> | null;
  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj(SessionService, ['getUserState']);

    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    });
  });

  afterAll(() => {
    mockSessionService = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should resolve user state', async () => {
    if (!mockSessionService) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockUserState: ISessionUserState = SESSION_USER_STATE_MOCK;
    mockSessionService.getUserState.and.returnValue(of(mockUserState));

    const urlPath = 'account-enquiry-search';
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };

    const result = await executeResolver(dummyRoute, dummyState);
    expect(result).toEqual(mockUserState);
  });
});
