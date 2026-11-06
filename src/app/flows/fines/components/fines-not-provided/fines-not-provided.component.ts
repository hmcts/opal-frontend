import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FINES_DEFAULT_VALUES } from '../../constants/fines-default-values.constant';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { getFeatureFlagReleaseState } from '../../utils/fines-section-permissions.utils';

@Component({
  selector: 'app-fines-not-provided',
  templateUrl: './fines-not-provided.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesNotProvidedComponent {
  private readonly globalStore = inject(GlobalStore);

  public readonly defaultValues = FINES_DEFAULT_VALUES;
  public readonly release1a1_2Enabled = computed(
    () => getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true,
  );
}
