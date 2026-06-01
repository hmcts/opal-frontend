import { type FeatureFlagReleaseDashboardGroups } from '../types/feature-flag-release-dashboard-groups.type';
import { RELEASE_1A_FEATURE_FLAG } from './release-feature-flags.constant';

export const FEATURE_FLAG_RELEASE_DASHBOARD_GROUPS: FeatureFlagReleaseDashboardGroups = {
  [RELEASE_1A_FEATURE_FLAG]: ['draft-accounts'],
};
