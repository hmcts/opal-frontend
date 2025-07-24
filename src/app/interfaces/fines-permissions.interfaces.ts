export interface IFinesDraftRoutingPermissions {
  'check-and-validate-draft-accounts': number;
  'create-and-manage-draft-accounts': number;
}

export interface IFinesMacPaymentTermsPermissionsValues {
  'collection-order': number;
}

export interface IFinesMacPaymentTermsPermissions {
  [key: number]: boolean;
}

export interface IFinesRoutingPermissions {
  'create-and-manage-draft-accounts': number;
  'search-and-view-accounts': number;
}

export interface IDashboardPermissions {
  'create-and-manage-draft-accounts': number;
  'check-and-validate-draft-accounts': number;
  'search-and-view-accounts': number;
}
