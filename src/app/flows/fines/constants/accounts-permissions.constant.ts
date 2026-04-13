import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const ACCOUNTS_PERMISSIONS = [
  FINES_PERMISSIONS['create-and-manage-draft-accounts'],
  FINES_PERMISSIONS['check-and-validate-draft-accounts'],
  FINES_PERMISSIONS['consolidate'],
] as const;
