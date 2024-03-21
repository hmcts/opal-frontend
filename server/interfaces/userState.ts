class UserState {
  userId!: string;
  userName!: string;
  roles?: Role[];
}

class Role {
  businessUserId!: string;
  businessUnit!: string;
  permissions?: Permissions[];
}

class Permissions {
  permissionId!: number;
  permissionName!: string;
}

export default UserState;
