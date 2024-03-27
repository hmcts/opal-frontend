import { TestBed } from '@angular/core/testing';

import { PermissionsService } from './permissions.service';
import { USER_STATE_MOCK } from '@mocks';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return unique permission IDs', () => {
    service.getUniquePermissions(USER_STATE_MOCK);
    expect(service['storedUniquePermissionIds']).toEqual([54, 41]);
  });

  it('should return permission access', () => {
    const hasPermissionAccess = service.hasPermissionAccess(54, 17, USER_STATE_MOCK.roles);
    expect(hasPermissionAccess).toBeTrue();
  });

  it('should not return permission access', () => {
    const hasPermissionAccess = service.hasPermissionAccess(54, 99, USER_STATE_MOCK.roles);
    expect(hasPermissionAccess).toBeFalse();
  });
});
