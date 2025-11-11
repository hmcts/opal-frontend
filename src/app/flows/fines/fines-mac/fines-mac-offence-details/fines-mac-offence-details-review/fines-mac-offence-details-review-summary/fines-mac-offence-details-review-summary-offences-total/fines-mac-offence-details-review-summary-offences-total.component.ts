import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IFinesMacOffenceDetailsReviewSummaryOffencesTotalTotals } from './interfaces/fines-mac-offence-details-review-summary-offences-total-totals.interface';
import { IFinesMacOffenceDetailsReviewSummaryForm } from '../../interfaces/fines-mac-offence-details-review-summary-form.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-offences-total',
  imports: [GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-offence-details-review-summary-offences-total.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent implements OnInit {
  private readonly utilsService = inject(UtilsService);
  private totalAmountImposed: number = 0;
  private totalAmountPaid: number = 0;
  private totalBalanceRemaining: number = 0;

  @Input({ required: true }) public offences!: IFinesMacOffenceDetailsReviewSummaryForm[];
  public totals!: IFinesMacOffenceDetailsReviewSummaryOffencesTotalTotals;

  /**
   * Calculates the total amounts for the offences.
   */
  private getTotals(): void {
    for (const offence of this.offences) {
      for (const imposition of offence.formData.fm_offence_details_impositions) {
        if (imposition.fm_offence_details_amount_imposed && imposition.fm_offence_details_balance_remaining) {
          const amountImposed: number = +imposition.fm_offence_details_amount_imposed;
          const amountPaid: number = +imposition.fm_offence_details_amount_paid!;
          const balanceRemaining: number = +imposition.fm_offence_details_balance_remaining;

          this.totalAmountImposed += amountImposed;
          this.totalAmountPaid += amountPaid;
          this.totalBalanceRemaining += balanceRemaining;
        }
      }
    }

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
