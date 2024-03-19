import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionsGuard } from './permissions.guard';

describe('permissionsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
