import {
  IFinesDraftRoutingPermissions,
  IDashboardPermissions,
  IFinesMacPaymentTermsPermissionsValues,
  IFinesRoutingPermissions,
} from '../interfaces/fines-permissions.interfaces';

export const FINES_MAC_PAYMENT_TERMS_PERMISSIONS: IFinesMacPaymentTermsPermissionsValues = {
  'collection-order': 4,
};

export const FINES_ROUTING_PERMISSIONS: IFinesRoutingPermissions = {
  'create-and-manage-draft-accounts': 1,
  'search-and-view-accounts': 6,
};

export const DASHBOARD_PERMISSIONS: IDashboardPermissions = {
  'create-and-manage-draft-accounts': 1,
  'check-and-validate-draft-accounts': 5,
  'search-and-view-accounts': 6,
};

export const FINES_DRAFT_ROUTING_PERMISSIONS: IFinesDraftRoutingPermissions = {
  'create-and-manage-draft-accounts': 1,
  'check-and-validate-draft-accounts': 5,
};

export const FINES_ACC_ROUTING_PERMISSIONS: IFinesRoutingPermissions = {
  'create-and-manage-draft-accounts': 1,
  'search-and-view-accounts': 6,
};
