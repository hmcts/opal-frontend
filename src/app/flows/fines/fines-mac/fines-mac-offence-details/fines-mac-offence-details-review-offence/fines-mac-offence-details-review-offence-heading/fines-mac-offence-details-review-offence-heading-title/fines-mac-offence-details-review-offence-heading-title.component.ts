import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukSummaryListRowActionItemComponent,
  GovukSummaryListRowActionsComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { FinesMacOffenceDetailsService } from '../../../services/fines-mac-offence-details.service';

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
  private readonly offenceDetailsService = inject(FinesMacOffenceDetailsService);

  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: false }) public offenceId: number | null = null;
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
    const exactMatch = this.offenceDetailsService.findExactOffenceMatch(
      this.offenceRefData,
      this.offenceCode,
      this.offenceId,
    );
    this.offenceTitle = exactMatch?.offence_title ?? this.offenceRefData.refData[0]?.offence_title ?? '';
  }

  public ngOnInit(): void {
    this.getOffenceTitle();
  }
}
