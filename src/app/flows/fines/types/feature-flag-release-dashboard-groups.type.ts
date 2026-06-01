import { type FeatureFlagReleaseName } from './feature-flag-release-name.type';

export type FeatureFlagReleaseDashboardGroups = Partial<Record<FeatureFlagReleaseName, readonly string[]>>;
