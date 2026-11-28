import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const FINANCE_PERMISSIONS = [
  FINES_PERMISSIONS['process-and-allocate-payments'],
  FINES_PERMISSIONS['view-interface-files'],
  FINES_PERMISSIONS['create-interface-files'],
  FINES_PERMISSIONS['view-suspense-items'],
  FINES_PERMISSIONS['manage-suspense-items'],
] as const;
