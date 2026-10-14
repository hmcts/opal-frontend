import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukSummaryListRowActionItemComponent,
  GovukSummaryListRowActionsComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { RELEASE_1A_1_2_FEATURE_FLAG } from '../../../../../constants/release-feature-flags.constant';
import { getFeatureFlagReleaseState } from '../../../../../utils/fines-section-permissions.utils';

@Component({
  selector: 'app-fines-mac-offence-details-review-offence-heading-title',
  imports: [
    CommonModule,
    GovukHeadingWithCaptionComponent,
    GovukSummaryListRowActionsComponent,
    GovukSummaryListRowActionItemComponent,
  ],
  templateUrl: './fines-mac-offence-details-review-offence-heading-title.component.html',
  styleUrl: './fines-mac-offence-details-review-offence-heading-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent {
  private readonly globalStore = inject(GlobalStore);

  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: true }) public offenceTitle!: string;
  @Input({ required: false }) public showActions!: boolean;
  @Input({ required: false }) public isReadOnly: boolean = false;
  @Output() public actionClicked = new EventEmitter<string>();

  public readonly headingLevel = computed(() =>
    getFeatureFlagReleaseState(this.globalStore.featureFlags())[RELEASE_1A_1_2_FEATURE_FLAG] === true ? 3 : 2,
  );

  /**
   * Handles the click event on the action button.
   * @param action - The action to be performed.
   */
  public onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }
}
