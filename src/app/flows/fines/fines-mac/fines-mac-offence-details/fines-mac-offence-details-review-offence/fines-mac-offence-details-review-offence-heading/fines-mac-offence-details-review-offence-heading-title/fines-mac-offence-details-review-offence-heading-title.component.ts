import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  GovukHeadingWithCaptionComponent,
  GovukSummaryListRowActionItemComponent,
  GovukSummaryListRowActionsComponent,
} from '@hmcts/opal-frontend-common/components/govuk';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

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
export class FinesMacOffenceDetailsReviewOffenceHeadingTitleComponent implements OnInit {
  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: true }) public offenceRefData!: IOpalFinesOffencesRefData;
  @Input({ required: false }) public showActions!: boolean;
  @Input({ required: false }) public showDetails: boolean = true;
  @Input({ required: false }) public isReadOnly: boolean = false;
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
