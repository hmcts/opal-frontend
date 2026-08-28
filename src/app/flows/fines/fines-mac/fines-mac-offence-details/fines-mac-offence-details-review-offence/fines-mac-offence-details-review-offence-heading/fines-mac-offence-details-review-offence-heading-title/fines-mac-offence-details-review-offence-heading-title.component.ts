import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukSummaryListRowActionItemComponent,
  GovukSummaryListRowActionsComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';

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
  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: true }) public offenceTitle!: string;
  @Input({ required: false }) public showActions!: boolean;
  @Input({ required: false }) public showDetails: boolean = true;
  @Input({ required: false }) public isReadOnly: boolean = false;
  @Output() public actionClicked = new EventEmitter<string>();

  /**
   * Handles the click event on the action button.
   * @param action - The action to be performed.
   */
  public onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }
}
