import { type FeatureFlagReleaseDashboardGroups } from '../types/feature-flag-release-dashboard-groups.type';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
  RELEASE_1C_ADMINISTRATION_FEATURE_FLAG,
  RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG,
} from './release-feature-flags.constant';

export const FEATURE_FLAG_RELEASE_DASHBOARD_GROUPS: FeatureFlagReleaseDashboardGroups = {
  [RELEASE_1A_FEATURE_FLAG]: ['draft-accounts'],
  [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: ['account-management'],
  [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: ['operational-reports'],
  // `administration-placeholder` is a placeholder group id until the Administration dashboard content is developed.
  [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG]: ['administration-placeholder'],
  // `finance-placeholder` is a placeholder group id until the Financial Movements dashboard content is developed.
  [RELEASE_1C_FINANCIAL_MOVEMENTS_FEATURE_FLAG]: ['finance-placeholder'],
};
