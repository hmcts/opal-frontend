export interface ISessionUserStatePermission {
  permission_id: number;
  permission_name: string;
}

export interface ISessionUserStateRole {
  business_unit_user_id: string;
  business_unit_id: number;
  permissions: ISessionUserStatePermission[];
}

export interface ISessionUserState {
  user_id: string;
  user_name: string;
  name: string;
  business_unit_user: ISessionUserStateRole[];
}
