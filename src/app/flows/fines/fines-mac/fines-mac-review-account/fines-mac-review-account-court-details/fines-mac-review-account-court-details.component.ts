import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourt } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

@Component({
  selector: 'app-fines-mac-review-account-court-details',
  standalone: true,
  imports: [GovukSummaryCardListComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-review-account-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountCourtDetailsComponent implements OnInit {
  @Input({ required: true }) public courtDetails!: IFinesMacCourtDetailsState;
  @Input({ required: true }) public enforcementCourtsData!: IOpalFinesCourt[];

  private opalFinesService = inject(OpalFines);
  public enforcementCourt!: string;

  private getEnforcementCourt(): void {
    const court = this.enforcementCourtsData.find(
      (court: IOpalFinesCourt) => court.court_id === +this.courtDetails.fm_court_details_enforcement_court_id!,
    )!;

    this.enforcementCourt = this.opalFinesService.getCourtPrettyName(court);
  }

  private getCourtDetailsData(): void {
    this.getEnforcementCourt();
  }

  public ngOnInit(): void {
    this.getCourtDetailsData();
  }
}
