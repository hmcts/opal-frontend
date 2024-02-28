class UserState {
  userId!: number;
  userName!: string;
  roles?: Role[];
}

class Role {
  businessUserId!: number;
  businessUnit!: string;
  permissions?: Permissions[];
}

class Permissions {
  permissionId!: number;
  permissionName!: string;
}

export default UserState;
