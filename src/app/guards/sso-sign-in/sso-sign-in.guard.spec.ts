import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ssoEnabledGuard } from './sso-sign-in..guard';

describe('ssoEnabledGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => ssoEnabledGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
