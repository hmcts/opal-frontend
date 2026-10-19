import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

// TODO(PO-9798): Add the confirmed View/Manage suspense IDs here and to
// FEATURE_FLAG_RELEASE_PERMISSIONS, FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS
// and FINANCE_SUSPENSE_LINKS. Suspense-only Finance access remains pending until then.
export const FINANCE_PERMISSIONS = [
  FINES_PERMISSIONS['process-and-allocate-payments'],
  FINES_PERMISSIONS['view-interface-files'],
  FINES_PERMISSIONS['create-interface-files'],
] as const;
