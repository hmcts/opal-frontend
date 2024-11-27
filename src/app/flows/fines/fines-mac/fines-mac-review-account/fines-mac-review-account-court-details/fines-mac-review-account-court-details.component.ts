import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourt } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';

@Component({
  selector: 'app-fines-mac-review-account-court-details',
  standalone: true,
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
  ],
  templateUrl: './fines-mac-review-account-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountCourtDetailsComponent implements OnInit {
  @Input({ required: true }) public courtDetails!: IFinesMacCourtDetailsState;
  @Input({ required: true }) public enforcementCourtsData!: IOpalFinesCourt[];
  @Output() public emitChangeCourtDetails = new EventEmitter<void>();

  private readonly opalFinesService = inject(OpalFines);
  public enforcementCourt!: string;

  /**
   * Retrieves the enforcement court details based on the court ID from the court details.
   * It finds the corresponding court from the enforcement courts data and sets the
   * enforcement court property with a pretty name of the court.
   *
   * @private
   * @method getEnforcementCourt
   * @returns {void}
   */
  private getEnforcementCourt(): void {
    const court = this.enforcementCourtsData.find(
      (court: IOpalFinesCourt) => court.court_id === +this.courtDetails.fm_court_details_enforcement_court_id!,
    )!;

    this.enforcementCourt = this.opalFinesService.getCourtPrettyName(court);
  }

  /**
   * Retrieves and processes the court details data.
   * This method calls the `getEnforcementCourt` function to fetch the necessary court information.
   *
   * @private
   */
  private getCourtDetailsData(): void {
    this.getEnforcementCourt();
  }

  /**
   * Emits an event to indicate that court details needs changed.
   * This method triggers the `emitChangeCourtDetails` event emitter.
   */
  public changeCourtDetails(): void {
    this.emitChangeCourtDetails.emit();
  }

  public ngOnInit(): void {
    this.getCourtDetailsData();
  }
}
