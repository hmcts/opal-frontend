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
import { FinesMacOffenceDetailsReviewSummaryImpositionTableDefaultCreditor } from './enums/fines-mac-offence-details-review-summary-imposition-table-default-creditor.enum';

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
  private readonly defaultValues = FinesMacOffenceDetailsReviewSummaryImpositionTableDefaultCreditor;

  /**
   * Sorts the impositions array based on the allocation order and result title.
   */
  private sortImpositionsByAllocationOrder(): void {
    const allocationOrderMap = this.impositionRefData.refData.reduce(
      (acc, item) => {
        acc[item.result_id] = {
          allocationOrder: item.imposition_allocation_order!,
          resultTitle: item.result_title,
        };
        return acc;
      },
      {} as { [key: string]: { allocationOrder: number; resultTitle: string } },
    );

    this.impositions.sort((a, b) => {
      const impositionA = allocationOrderMap[a.fm_offence_details_result_code!];
      const impositionB = allocationOrderMap[b.fm_offence_details_result_code!];

      const allocationOrderComparison = impositionA.allocationOrder - impositionB.allocationOrder;
      if (allocationOrderComparison !== 0) {
        return allocationOrderComparison;
      }

      return impositionA.resultTitle.localeCompare(impositionB.resultTitle);
    });
  }

  /**
   * Retrieves the creditor information based on the provided creditor and major creditor ID.
   * If the creditor is 'major', it retrieves the major creditor information from the refData.
   * If the creditor is not 'major', it uses the default minor creditor value.
   * If the creditor is null, it uses the default creditor value.
   *
   * @param creditor - The type of creditor ('major' or null).
   * @param majorCreditor - The ID of the major creditor.
   * @returns The creditor information as a string.
   */
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
        creditorText = this.defaultValues.defaultMinorCreditor;
      }
    } else {
      creditorText = this.defaultValues.defaultCreditor;
    }

    return creditorText;
  }

  /**
   * Retrieves the imposition data and calculates the total amounts.
   */
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

  /**
   * Retrieves the impositions total data and assigns it to the `impositionsTotalsData` property.
   * The total amount imposed, total amount paid, and total balance remaining are converted to monetary strings.
   */
  private getImpositionsTotalData(): void {
    this.impositionsTotalsData = {
      totalAmountImposed: this.utilsService.convertToMonetaryString(this.totalAmountImposed),
      totalAmountPaid: this.utilsService.convertToMonetaryString(this.totalAmountPaid),
      totalBalanceRemaining: this.utilsService.convertToMonetaryString(this.totalBalanceRemaining),
    };
  }

  public ngOnInit(): void {
    this.sortImpositionsByAllocationOrder();
    this.getImpositionData();
  }
}
