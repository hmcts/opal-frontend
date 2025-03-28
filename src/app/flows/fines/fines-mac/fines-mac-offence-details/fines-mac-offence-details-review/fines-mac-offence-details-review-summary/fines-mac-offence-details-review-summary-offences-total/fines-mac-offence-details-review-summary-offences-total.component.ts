import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacOffenceDetailsReviewSummaryOffencesTotalTotals } from './interfaces/fines-mac-offence-details-review-summary-offences-total-totals.interface';
import { IFinesMacOffenceDetailsReviewSummaryForm } from '../../interfaces/fines-mac-offence-details-review-summary-form.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/core/services';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-offences-total',
  imports: [GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-offence-details-review-summary-offences-total.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent implements OnInit {
  @Input({ required: true }) public offences!: IFinesMacOffenceDetailsReviewSummaryForm[];

  private readonly utilsService = inject(UtilsService);

  public totals!: IFinesMacOffenceDetailsReviewSummaryOffencesTotalTotals;
  private totalAmountImposed: number = 0;
  private totalAmountPaid: number = 0;
  private totalBalanceRemaining: number = 0;

  /**
   * Calculates the total amounts for the offences.
   */
  private getTotals(): void {
    this.offences.forEach((offence) => {
      offence.formData.fm_offence_details_impositions.forEach((imposition) => {
        if (imposition.fm_offence_details_amount_imposed && imposition.fm_offence_details_balance_remaining) {
          const amountImposed: number = +imposition.fm_offence_details_amount_imposed;
          const amountPaid: number = +imposition.fm_offence_details_amount_paid!;
          const balanceRemaining: number = +imposition.fm_offence_details_balance_remaining;

          this.totalAmountImposed += amountImposed;
          this.totalAmountPaid += amountPaid;
          this.totalBalanceRemaining += balanceRemaining;
        }
      });
    });

    this.totals = {
      amountImposedTotal: this.utilsService.convertToMonetaryString(this.totalAmountImposed),
      amountPaidTotal: this.utilsService.convertToMonetaryString(this.totalAmountPaid),
      balanceRemainingTotal: this.utilsService.convertToMonetaryString(this.totalBalanceRemaining),
    };
  }

  public ngOnInit(): void {
    this.getTotals();
  }
}
