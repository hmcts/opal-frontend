import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const REPORTS_PERMISSIONS = [
  FINES_PERMISSIONS['operational-report-by-enforcement'],
  FINES_PERMISSIONS['operational-report-by-payments'],
] as const;
