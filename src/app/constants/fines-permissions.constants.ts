import { IFinesPermissions } from '../interfaces/fines-permissions.interfaces';

export const FINES_PERMISSIONS: IFinesPermissions = {
  'create-and-manage-draft-accounts': 1,
  'account-notes': 2, // assumed, TBC
  'account-enquiry': 3,
  'collection-order': 4,
  'check-and-validate-draft-accounts': 5,
  'search-and-view-accounts': 6,
  'account-maintenance': 7, // assumed, TBC
};
