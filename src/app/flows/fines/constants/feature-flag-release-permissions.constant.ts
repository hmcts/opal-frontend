import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { type FeatureFlagReleasePermissions } from '../types/feature-flag-release-permissions.type';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
} from './release-feature-flags.constant';
import { REPORTS_PERMISSIONS } from './reports-permissions.constant';

export const FEATURE_FLAG_RELEASE_PERMISSIONS: FeatureFlagReleasePermissions = {
  [RELEASE_1A_FEATURE_FLAG]: [
    FINES_PERMISSIONS['create-and-manage-draft-accounts'],
    FINES_PERMISSIONS['check-and-validate-draft-accounts'],
  ],
  [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: [FINES_PERMISSIONS['consolidate']],
  [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: REPORTS_PERMISSIONS,
};
