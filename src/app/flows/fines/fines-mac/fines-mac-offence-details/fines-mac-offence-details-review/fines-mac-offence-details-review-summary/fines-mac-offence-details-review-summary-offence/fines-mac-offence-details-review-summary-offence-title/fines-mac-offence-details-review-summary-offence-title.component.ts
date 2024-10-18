import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GovukHeadingWithCaptionComponent } from '@components/govuk/govuk-heading-with-caption/govuk-heading-with-caption.component';
import { GovukSummaryListRowActionItemComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-action-item/govuk-summary-list-row-action-item.component';
import { GovukSummaryListRowActionsComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-actions.component';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-offence-title',
  standalone: true,
  imports: [
    GovukHeadingWithCaptionComponent,
    GovukSummaryListRowActionsComponent,
    GovukSummaryListRowActionItemComponent,
  ],
  templateUrl: './fines-mac-offence-details-review-summary-offence-title.component.html',
  styleUrl: './fines-mac-offence-details-review-summary-offence-title.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent implements OnInit {
  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: true }) public offenceRefData!: IOpalFinesOffencesRefData;
  @Output() public actionClicked = new EventEmitter<string>();

  public offenceTitle!: string;

  /**
   * Handles the click event on the action button.
   * @param action - The action to be performed.
   */
  public onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }

  /**
   * Retrieves the offence title from the offence reference data and assigns it to the `offenceTitle` property.
   */
  public getOffenceTitle(): void {
    this.offenceTitle = this.offenceRefData.refData[0].offence_title;
  }

  public ngOnInit(): void {
    this.getOffenceTitle();
  }
}
