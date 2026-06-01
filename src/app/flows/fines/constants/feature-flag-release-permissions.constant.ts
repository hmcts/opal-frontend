import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { type FeatureFlagReleasePermissions } from '../types/feature-flag-release-permissions.type';
import { RELEASE_1A_FEATURE_FLAG } from './release-feature-flags.constant';

export const FEATURE_FLAG_RELEASE_PERMISSIONS: FeatureFlagReleasePermissions = {
  [RELEASE_1A_FEATURE_FLAG]: [
    FINES_PERMISSIONS['create-and-manage-draft-accounts'],
    FINES_PERMISSIONS['check-and-validate-draft-accounts'],
  ],
};
