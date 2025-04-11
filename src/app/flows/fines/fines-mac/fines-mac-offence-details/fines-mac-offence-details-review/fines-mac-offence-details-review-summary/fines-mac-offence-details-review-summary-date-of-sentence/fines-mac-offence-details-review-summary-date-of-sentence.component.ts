import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';

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
