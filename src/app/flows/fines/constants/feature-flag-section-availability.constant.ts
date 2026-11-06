import { type DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { type FeatureFlagReleaseName } from '../types/feature-flag-release-name.type';
import { RELEASE_1C_ADMINISTRATION_FEATURE_FLAG } from './release-feature-flags.constant';

export const FEATURE_FLAG_SECTION_AVAILABILITY: Partial<Record<DashboardPageType, readonly FeatureFlagReleaseName[]>> =
  {
    administration: [RELEASE_1C_ADMINISTRATION_FEATURE_FLAG],
  };
