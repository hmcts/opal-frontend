export interface IUserStatePermission {
  permissionId: number;
  permissionName: string;
}

export interface IUserStateRole {
  businessUserId: string;
  businessUnitId: number;
  permissions: IUserStatePermission[];
}

export interface IUserState {
  userId: string;
  userName: string;
  roles: IUserStateRole[];
}
