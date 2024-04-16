import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, UrlSegment } from '@angular/router';

import { userStateResolver } from './user-state.resolver';
import { IUserState } from '@interfaces';
import { of } from 'rxjs';

import { USER_STATE_MOCK } from '@mocks';
import { SessionService } from '@services';

describe('userStateResolver', () => {
  const executeResolver: ResolveFn<IUserState> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => userStateResolver(...resolverParameters));
  let mockSessionService: jasmine.SpyObj<SessionService>;
  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj(SessionService, ['getUserState']);

    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    });
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });

  it('should resolve user state', async () => {
    const mockUserState: IUserState = USER_STATE_MOCK;
    mockSessionService.getUserState.and.returnValue(of(mockUserState));

    const urlPath = 'account-enquiry-search';
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };

    const result = await executeResolver(dummyRoute, dummyState);
    expect(result).toEqual(mockUserState);
  });
});
