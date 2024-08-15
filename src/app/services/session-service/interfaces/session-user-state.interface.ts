export interface ISessionUserStatePermission {
  permissionId: number;
  permissionName: string;
}

export interface ISessionUserStateRole {
  businessUserId: string;
  businessUnitId: number;
  permissions: ISessionUserStatePermission[];
}

export interface ISessionUserState {
  userId: string;
  userName: string;
  roles: ISessionUserStateRole[];
}
