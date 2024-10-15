import { Component, Input } from '@angular/core';
import { GovukHeadingWithCaptionComponent } from '@components/govuk/govuk-heading-with-caption/govuk-heading-with-caption.component';
import { GovukSummaryListRowActionsComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-actions.component';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-offence-title',
  standalone: true,
  imports: [GovukHeadingWithCaptionComponent, GovukSummaryListRowActionsComponent],
  templateUrl: './fines-mac-offence-details-review-summary-offence-title.component.html',
  styleUrl: './fines-mac-offence-details-review-summary-offence-title.component.scss',
})
export class FinesMacOffenceDetailsReviewSummaryOffenceTitleComponent {
  @Input({ required: true }) public offenceCode!: string;
  @Input({ required: true }) public offenceRefData!: IOpalFinesOffencesRefData;
}
