import { TestBed } from '@angular/core/testing';

import { PermissionsService } from './permissions.service';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';

describe('PermissionsService', () => {
  let service: PermissionsService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsService);
  });

  afterAll(() => {
    service = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return unique permission IDs', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    service.getUniquePermissions(SESSION_USER_STATE_MOCK);
    expect(service['storedUniquePermissionIds']).toEqual([54, 41]);
  });

  it('should return permission access', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const hasPermissionAccess = service.hasPermissionAccess(54, 17, SESSION_USER_STATE_MOCK['business_unit_user']);
    expect(hasPermissionAccess).toBeTrue();
  });

  it('should not return permission access', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const hasPermissionAccess = service.hasPermissionAccess(54, 99, SESSION_USER_STATE_MOCK['business_unit_user']);
    expect(hasPermissionAccess).toBeFalse();
  });

  it('should return true when no roles are provided', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const result = service.hasPermissionAccess(1, 1, []);
    expect(result).toBeTrue();
  });
});
