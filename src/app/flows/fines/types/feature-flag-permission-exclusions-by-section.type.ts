import { type DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { type FeatureFlagReleaseName } from './feature-flag-release-name.type';

export type PermissionIds = readonly number[];

export type FeatureFlagPermissionExclusionsBySection = {
  [sectionKey in DashboardPageType]?: {
    [featureFlagName in FeatureFlagReleaseName]?: PermissionIds;
  };
};
