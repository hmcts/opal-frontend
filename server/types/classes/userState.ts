class UserState {
  userId!: number;
  userName!: string;
  roles?: Role[];
}

class Role {
  roleId!: number;
  roleName!: string;
  permissions?: Permissions[];
}

class Permissions {
  permissionId!: number;
  permissionName!: string;
}

export default UserState;
