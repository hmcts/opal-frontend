import { Injectable } from '@angular/core';
import { IUserState, IUserStatePermission, IUserStateRole } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private storedUniquePermissionIds: number[] = [];

  /**
   * Retrieves the unique permission IDs associated with the user.
   * If the unique permission IDs have not been stored yet, it calculates them based on the user's roles and permissions.
   * @returns An array of unique permission IDs.
   */
  public getUniquePermissions(userState: IUserState | null): number[] {
    const roles = userState?.roles;

    if (!this.storedUniquePermissionIds.length && roles) {
      const permissionIds = roles.flatMap((role) => {
        return role.permissions.map(({ permissionId }) => permissionId);
      });

      this.storedUniquePermissionIds = [...new Set(permissionIds)];
    }

    return this.storedUniquePermissionIds;
  }

  public hasPermissionAccess(permissionId: number, businessUnitId: number, roles: IUserStateRole[]): boolean {
    if (roles && roles.length) {
      // First we need to find the matching role
      const role = roles?.find((role) => role.businessUnitId === businessUnitId);

      // Then we need to find the matching permission
      const permission = role?.permissions.find(
        (permission: IUserStatePermission) => permission.permissionId === permissionId,
      );

      return permission ? true : false;
    }
    // if we don't have any roles, we can't have any permissions
    return true;
  }
}
