import { type FeatureFlagReleaseDashboardHighlights } from '../types/feature-flag-release-dashboard-highlights.type';
import { RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG } from './release-feature-flags.constant';

export const FEATURE_FLAG_RELEASE_DASHBOARD_HIGHLIGHTS: FeatureFlagReleaseDashboardHighlights = {
  [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: ['user-reports'],
};
