import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesMacOffenceDetailsImpositionsState } from '../../interfaces/fines-mac-offence-details-impositions-state.interface';
import {
  IFinesMacOffenceDetailsReviewSummaryImpositionTableData,
  IFinesMacOffenceDetailsReviewSummaryImpositionTableRowTotalData,
  IFinesMacOffenceDetailsReviewSummaryMinorCreditorTableData,
} from './interfaces/fines-mac-offence-details-review-offence-imposition-data.interface';
import {
  GovukTableBodyRowDataComponent,
  GovukTableBodyRowComponent,
  GovukTableHeadingComponent,
  GovukTableComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { CommonModule } from '@angular/common';
import { FINES_MAC_OFFENCE_DETAILS_REVIEW_OFFENCE_IMPOSITION_DEFAULT_VALUES } from './constants/fines-mac-offence-details-review-offence-imposition-default-values.constant';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesNotProvidedComponent } from "src/app/flows/fines/components/fines-not-provided/fines-not-provided.component";

@Component({
  selector: 'app-fines-mac-offence-details-review-offence-imposition',
  imports: [
    CommonModule,
    GovukTableComponent,
    GovukTableHeadingComponent,
    GovukTableBodyRowComponent,
    GovukTableBodyRowDataComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesNotProvidedComponent
],
  templateUrl: './fines-mac-offence-details-review-offence-imposition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsReviewOffenceImpositionComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesMacStore = inject(FinesMacStore);
  private totalAmountImposed: number = 0;
  private totalAmountPaid: number = 0;
  private totalBalanceRemaining: number = 0;

  protected readonly defaultValues = FINES_MAC_OFFENCE_DETAILS_REVIEW_OFFENCE_IMPOSITION_DEFAULT_VALUES;

  @Input({ required: true }) public impositionRefData!: IOpalFinesResultsRefData;
  @Input({ required: true }) public majorCreditorRefData!: IOpalFinesMajorCreditorRefData;
  @Input({ required: true }) public impositions!: IFinesMacOffenceDetailsImpositionsState[];
  @Input({ required: true }) public offenceIndex!: number;
  @Input({ required: false }) public isReadOnly!: boolean;
  public readonly utilsService = inject(UtilsService);
  public impositionTableData!: IFinesMacOffenceDetailsReviewSummaryImpositionTableData[];
  public impositionsTotalsData!: IFinesMacOffenceDetailsReviewSummaryImpositionTableRowTotalData;

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
      const impositionA = allocationOrderMap[a.fm_offence_details_result_id!];
      const impositionB = allocationOrderMap[b.fm_offence_details_result_id!];

      if (impositionA && impositionB) {
        const allocationOrderComparison = impositionA.allocationOrder - impositionB.allocationOrder;
        if (allocationOrderComparison !== 0) {
          return allocationOrderComparison;
        }
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
    const majorCreditorRefData = this.majorCreditorRefData.refData.find(
      (creditor) => creditor.major_creditor_id === majorCreditor,
    );
    return this.opalFinesService.getMajorCreditorPrettyName(majorCreditorRefData!);
  }

  /**
   * Retrieves the text representation of a minor creditor based on the imposition ID.
   * @param impositionId - The ID of the imposition.
   * @returns The text representation of the minor creditor.
   */
  private getMinorCreditorText(impositionId: number): string {
    const offenceDetails = this.finesMacStore.offenceDetails()[this.offenceIndex];
    const minorCreditor = offenceDetails.childFormData!.find(
      (childFormData) => childFormData.formData.fm_offence_details_imposition_position === impositionId,
    );

    if (!minorCreditor) return FINES_MAC_OFFENCE_DETAILS_REVIEW_OFFENCE_IMPOSITION_DEFAULT_VALUES.defaultMinorCreditor;

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
   * Retrieves the minor creditor data for a given imposition ID.
   *
   * @param impositionId - The ID of the imposition to retrieve the minor creditor data for.
   * @returns An object containing the minor creditor data, or null if no data is found.
   *
   * The returned object includes the following properties:
   * - `address`: The formatted address of the minor creditor, or null if no address is available.
   * - `paymentMethod`: The payment method if pay by BACS is enabled, or null otherwise.
   * - `nameOnAccount`: The name on the bank account of the minor creditor.
   * - `sortCode`: The formatted sort code of the minor creditor's bank account, or null if not available.
   * - `accountNumber`: The bank account number of the minor creditor.
   * - `paymentReference`: The payment reference for the minor creditor's bank account.
   */
  private getMinorCreditorData(
    impositionId: number,
  ): IFinesMacOffenceDetailsReviewSummaryMinorCreditorTableData | null {
    if (
      this.finesMacStore.offenceDetails().length === 0 ||
      !this.finesMacStore.offenceDetails()[this.offenceIndex]?.childFormData
    )
      return null;
    const offenceDetails = this.finesMacStore.offenceDetails()[this.offenceIndex];
    const minorCreditor = offenceDetails.childFormData!.find(
      (childFormData) => childFormData.formData.fm_offence_details_imposition_position === impositionId,
    );

    if (!minorCreditor) return null;

    const {
      fm_offence_details_minor_creditor_address_line_1: addressLine1,
      fm_offence_details_minor_creditor_address_line_2: addressLine2,
      fm_offence_details_minor_creditor_address_line_3: addressLine3,
      fm_offence_details_minor_creditor_post_code: postCode,
      fm_offence_details_minor_creditor_pay_by_bacs: payByBacs,
      fm_offence_details_minor_creditor_bank_account_name: bankAccountName,
      fm_offence_details_minor_creditor_bank_sort_code: bankSortCode,
      fm_offence_details_minor_creditor_bank_account_number: bankAccountNumber,
      fm_offence_details_minor_creditor_bank_account_ref: bankAccountRef,
    } = minorCreditor.formData;

    const formattedAddress = this.utilsService.formatAddress([addressLine1, addressLine2, addressLine3, postCode]);

    return {
      address: formattedAddress.length > 0 ? formattedAddress : [],
      paymentMethod: payByBacs
        ? FINES_MAC_OFFENCE_DETAILS_REVIEW_OFFENCE_IMPOSITION_DEFAULT_VALUES.defaultPaymentMethod
        : null,
      nameOnAccount: bankAccountName,
      sortCode: bankSortCode ? this.utilsService.formatSortCode(bankSortCode) : null,
      accountNumber: bankAccountNumber,
      paymentReference: bankAccountRef,
    };
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

      const resultCodeImposition = this.impositionRefData.refData.find(
        (refData) => refData.result_id === imposition.fm_offence_details_result_id,
      )!;

      return {
        impositionId: imposition.fm_offence_details_imposition_id!,
        impositionDescription: resultCodeImposition.result_title,
        creditor: this.getCreditorInformation(
          imposition.fm_offence_details_creditor,
          imposition.fm_offence_details_major_creditor_id,
          resultCodeImposition.imposition_creditor,
          imposition.fm_offence_details_imposition_id!,
        ),
        minorCreditor: this.getMinorCreditorData(imposition.fm_offence_details_imposition_id!),
        showMinorCreditorData: this.isReadOnly,
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

  public invertShowMinorCreditorData(impositionId: number): void {
    const imposition = this.impositionTableData.find((imposition) => imposition.impositionId === impositionId)!;
    imposition.showMinorCreditorData = !imposition.showMinorCreditorData;
  }

  public ngOnInit(): void {
    this.sortImpositionsByAllocationOrder();
    this.getImpositionData();
  }
}
