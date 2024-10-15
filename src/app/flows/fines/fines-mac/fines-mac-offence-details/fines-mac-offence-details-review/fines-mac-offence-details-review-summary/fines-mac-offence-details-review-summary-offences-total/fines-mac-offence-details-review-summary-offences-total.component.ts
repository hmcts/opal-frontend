import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacOffenceDetailsForm } from '../../../interfaces/fines-mac-offence-details-form.interface';
import { IFinesMacOffenceDetailsReviewSummaryOffencesTotalTotals } from './interfaces/fines-mac-offence-details-review-summary-offences-total-totals.interface';
import { UtilsService } from '@services/utils/utils.service';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-offences-total',
  standalone: true,
  imports: [GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mac-offence-details-review-summary-offences-total.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryOffencesTotalComponent implements OnInit {
  @Input({ required: true }) public offences!: IFinesMacOffenceDetailsForm[];

  private readonly utilsService = inject(UtilsService);

  public totals!: IFinesMacOffenceDetailsReviewSummaryOffencesTotalTotals;
  private totalAmountImposed: number = 0;
  private totalAmountPaid: number = 0;
  private totalBalanceRemaining: number = 0;

  private getTotals(): void {
    this.offences.forEach((offence) => {
      offence.formData.fm_offence_details_impositions.forEach((imposition) => {
        const amountImposed: number = +imposition.fm_offence_details_amount_imposed!;
        const amountPaid: number = +imposition.fm_offence_details_amount_paid!;
        const balanceRemaining: number = +imposition.fm_offence_details_balance_remaining!;

        this.totalAmountImposed += amountImposed;
        this.totalAmountPaid += amountPaid;
        this.totalBalanceRemaining += balanceRemaining;
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
