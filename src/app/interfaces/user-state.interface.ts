interface Permission {
  permissionId: number;
  permissionName: string;
}

interface Role {
  businessUserId: string;
  businessUnitId: number;
  permissions: Permission[];
}

export interface IUserState {
  userId: string;
  userName: string;
  roles: Role[];
}
