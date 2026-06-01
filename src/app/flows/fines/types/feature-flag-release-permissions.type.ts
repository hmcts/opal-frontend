import { type FeatureFlagReleaseName } from './feature-flag-release-name.type';

export type FeatureFlagReleasePermissions = Partial<Record<FeatureFlagReleaseName, readonly number[]>>;
