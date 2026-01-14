import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-date-of-sentence',
  imports: [GovukSummaryListComponent, GovukSummaryListRowComponent, DateFormatPipe],
  templateUrl: './fines-mac-offence-details-review-summary-date-of-sentence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryDateOfSentenceComponent {
  @Input({ required: true }) public dateOfSentence!: string;
}
