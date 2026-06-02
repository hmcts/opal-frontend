import { type FeatureFlagPermissionExclusionsBySection } from '../types/feature-flag-permission-exclusions-by-section.type';
import { FEATURE_FLAG_RELEASE_PERMISSIONS } from './feature-flag-release-permissions.constant';
import { RELEASE_1A_FEATURE_FLAG } from './release-feature-flags.constant';

export const FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS: FeatureFlagPermissionExclusionsBySection = {
  accounts: {
    [RELEASE_1A_FEATURE_FLAG]: FEATURE_FLAG_RELEASE_PERMISSIONS[RELEASE_1A_FEATURE_FLAG] ?? [],
  },
};
