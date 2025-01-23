import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { DateService } from '@services/date-service/date.service';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-date-of-sentence',

  imports: [GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-offence-details-review-summary-date-of-sentence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent {
  @Input({ required: true }) public dateOfSentence!: string;

  public dateService = inject(DateService);
}
