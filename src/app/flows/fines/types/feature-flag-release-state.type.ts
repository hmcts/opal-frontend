import { type FeatureFlagReleaseName } from './feature-flag-release-name.type';

export type FeatureFlagReleaseState = Partial<Record<FeatureFlagReleaseName, boolean>>;
