class UserState {
  user_id!: string;
  user_name!: string;
  business_unit_user?: BusinessUnitUser[];
}

class BusinessUnitUser {
  business_user_id!: string;
  business_unit!: string;
  permissions?: Permissions[];
}

class Permissions {
  permission_id!: number;
  permission_name!: string;
}

export default UserState;
