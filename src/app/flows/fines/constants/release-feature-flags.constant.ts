import { type FeatureFlagReleaseName } from '../types/feature-flag-release-name.type';

export const RELEASE_1A_FEATURE_FLAG = 'release-1a' satisfies FeatureFlagReleaseName;
export const RELEASE_1B_FEATURE_FLAG = 'release-1b' satisfies FeatureFlagReleaseName;
export const RELEASE_1C_WRITE_OFF_FEATURE_FLAG = 'release-1c-write-off' satisfies FeatureFlagReleaseName;
export const RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG =
  'release-1c-enforcement-operational-reporting' satisfies FeatureFlagReleaseName;

export const RELEASE_FEATURE_FLAGS = [
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1B_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
] as const;
