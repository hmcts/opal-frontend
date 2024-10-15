import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { GovukTableComponent } from '@components/govuk/govuk-table/govuk-table.component';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IFinesMacOffenceDetailsImpositionsState } from '../../../interfaces/fines-mac-offence-details-impositions-state.interface';
import { UtilsService } from '@services/utils/utils.service';
import {
  IFinesMacOffenceDetailsReviewSummaryImpositionTableData,
  IFinesMacOffenceDetailsReviewSummaryImpositionTableRowTotalData,
} from './interfaces/fines-mac-offence-details-review-summary-imposition-table-data.interface';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

@Component({
  selector: 'app-fines-mac-offence-details-review-summary-imposition-table',
  standalone: true,
  imports: [GovukTableComponent],
  templateUrl: './fines-mac-offence-details-review-summary-imposition-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewSummaryImpositionTableComponent implements OnInit {
  @Input({ required: true }) public impositionRefData!: IOpalFinesResultsRefData;
  @Input({ required: true }) public majorCreditorRefData!: IOpalFinesMajorCreditorRefData;
  @Input({ required: true }) public impositions!: IFinesMacOffenceDetailsImpositionsState[];

  private readonly opalFinesService = inject(OpalFines);
  public utilsService = inject(UtilsService);

  public impositionTableData!: IFinesMacOffenceDetailsReviewSummaryImpositionTableData[];
  public impositionsTotalsData!: IFinesMacOffenceDetailsReviewSummaryImpositionTableRowTotalData;
  private totalAmountImposed: number = 0;
  private totalAmountPaid: number = 0;
  private totalBalanceRemaining: number = 0;

  private getCreditorInformation(creditor: string | null, majorCreditor: number | null): string {
    let creditorText = '';
    if (creditor) {
      if (creditor === 'major') {
        if (majorCreditor) {
          const majorCreditorRefData = this.majorCreditorRefData.refData.filter(
            (x) => x.major_creditor_id === majorCreditor,
          )[0];
          creditorText = this.opalFinesService.getMajorCreditorPrettyName(majorCreditorRefData);
        }
      } else {
        creditorText = 'Minor Creditor';
      }
    } else {
      creditorText = 'HM Courts & Tribunals Service (HMCTS)';
    }

    return creditorText;
  }

  private getImpositionData(): void {
    this.impositionTableData = this.impositions.map((imposition) => {
      const amountImposed: number = +imposition.fm_offence_details_amount_imposed!;
      const amountPaid: number = +imposition.fm_offence_details_amount_paid!;
      const balanceRemaining: number = +imposition.fm_offence_details_balance_remaining!;

      this.totalAmountImposed += amountImposed;
      this.totalAmountPaid += amountPaid;
      this.totalBalanceRemaining += balanceRemaining;

      return {
        impositionDescription: this.impositionRefData.refData.filter(
          (refData) => refData.result_id === imposition.fm_offence_details_result_code,
        )[0].result_title,
        creditor: this.getCreditorInformation(
          imposition.fm_offence_details_creditor,
          imposition.fm_offence_details_major_creditor,
        ),
        amountImposed: this.utilsService.convertToMonetaryString(amountImposed),
        amountPaid: this.utilsService.convertToMonetaryString(amountPaid),
        balanceRemaining: this.utilsService.convertToMonetaryString(balanceRemaining),
      };
    });

    this.getImpositionsTotalData();
  }

  private getImpositionsTotalData(): void {
    this.impositionsTotalsData = {
      totalAmountImposed: this.utilsService.convertToMonetaryString(this.totalAmountImposed),
      totalAmountPaid: this.utilsService.convertToMonetaryString(this.totalAmountPaid),
      totalBalanceRemaining: this.utilsService.convertToMonetaryString(this.totalBalanceRemaining),
    };
  }

  public ngOnInit(): void {
    this.getImpositionData();
  }
}
