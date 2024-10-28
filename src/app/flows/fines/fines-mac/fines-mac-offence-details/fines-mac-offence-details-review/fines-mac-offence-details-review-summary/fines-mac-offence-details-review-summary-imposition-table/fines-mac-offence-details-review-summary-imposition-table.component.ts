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
import { FinesService } from '@services/fines/fines-service/fines.service';

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
  @Input({ required: true }) public offenceIndex!: number;

  private readonly opalFinesService = inject(OpalFines);
  private readonly finesService = inject(FinesService);
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
   * Retrieves the major creditor text based on the provided major creditor ID.
   * @param majorCreditor - The major creditor ID.
   * @returns The major creditor text.
   */
  private getMajorCreditorText(majorCreditor: number): string {
    const majorCreditorRefData = this.majorCreditorRefData.refData.find((x) => x.major_creditor_id === majorCreditor);
    return this.opalFinesService.getMajorCreditorPrettyName(majorCreditorRefData!);
  }

  /**
   * Retrieves the text representation of a minor creditor based on the imposition ID.
   * @param impositionId - The ID of the imposition.
   * @returns The text representation of the minor creditor.
   */
  private getMinorCreditorText(impositionId: number): string {
    const minorCreditor = this.finesService.finesMacState.offenceDetails[this.offenceIndex].childFormData!.find(
      (x) => x.formData.fm_offence_details_imposition_position === impositionId,
    );

    if (!minorCreditor) return FinesMacOffenceDetailsReviewSummaryImpositionTableDefaultCreditor.defaultMinorCreditor;

    const {
      fm_offence_details_minor_creditor_creditor_type: creditorType,
      fm_offence_details_minor_creditor_title: title,
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
      fm_offence_details_minor_creditor_company_name: companyName,
    } = minorCreditor.formData;

    return creditorType === 'individual' ? `${title ?? ''} ${forenames ?? ''} ${surname}`.trim() : companyName!;
  }

  /**
   * Returns the default creditor text based on the given resultCodeCreditor.
   * If the resultCodeCreditor is 'CPS', it returns the default CPS creditor text.
   * Otherwise, it returns the default creditor text.
   *
   * @param resultCodeCreditor - The resultCodeCreditor to determine the default creditor text.
   * @returns The default creditor text.
   */
  private getDefaultCreditorText(resultCodeCreditor: string): string {
    if (resultCodeCreditor === 'CPS') {
      return this.defaultValues.defaultCpsCreditor;
    }
    return this.defaultValues.defaultCreditor;
  }

  /**
   * Retrieves the creditor information based on the provided parameters.
   *
   * @param creditor - The creditor value.
   * @param majorCreditor - The major creditor value.
   * @param resultCodeCreditor - The result code creditor value.
   * @param impositionId - The imposition ID value.
   * @returns The creditor information as a string.
   */
  private getCreditorInformation(
    creditor: string | null,
    majorCreditor: number | null,
    resultCodeCreditor: string,
    impositionId: number,
  ): string {
    if (resultCodeCreditor === 'Any' || resultCodeCreditor === '!CPS') {
      if (creditor === 'major' && majorCreditor !== null) {
        return this.getMajorCreditorText(majorCreditor);
      } else {
        return this.getMinorCreditorText(impositionId);
      }
    } else {
      return this.getDefaultCreditorText(resultCodeCreditor);
    }
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

      const resultCodeImposition = this.impositionRefData.refData.filter(
        (refData) => refData.result_id === imposition.fm_offence_details_result_code,
      )[0];

      return {
        impositionDescription: resultCodeImposition.result_title,
        creditor: this.getCreditorInformation(
          imposition.fm_offence_details_creditor,
          imposition.fm_offence_details_major_creditor,
          resultCodeImposition.imposition_creditor,
          imposition.fm_offence_details_imposition_id!,
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
