import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { IFinesMacOffenceDetailsMinorCreditorState } from '../../../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE } from '../../../fines-mac-offence-details-minor-creditor/constants/fines-mac-offence-details-minor-creditor-state.constant';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowActionsComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-actions.component';
import { GovukSummaryListRowActionItemComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-action-item/govuk-summary-list-row-action-item.component';
import { FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList } from './enums/fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list.enum';
import { GovukSummaryCardActionComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-action/govuk-summary-card-action.component';
import { UtilsService } from '@services/utils/utils.service';

@Component({
  selector: 'app-fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list',
  standalone: true,
  imports: [
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardListComponent,
    GovukSummaryListRowActionsComponent,
    GovukSummaryListRowActionItemComponent,
    GovukSummaryCardActionComponent,
  ],
  templateUrl: './fines-mac-offence-details-add-an-offence-form-minor-creditor-summary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryListComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) public minorCreditor!: any;
  @Input({ required: true }) public index!: number;

  private readonly utilsService = inject(UtilsService);

  public minorCreditorData: IFinesMacOffenceDetailsMinorCreditorState = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE;
  public name!: string;
  public address!: string;
  public paymentMethod!: string;
  public accountName!: string;
  public sortCode!: string;
  public accountNumber!: string;
  public paymentReference!: string;

  /**
   * Sets up the initial setup for the minor creditor summary list.
   * This method strips the index suffix from object keys and initializes minorCreditorData.
   * It also populates information for the summary list.
   */
  private initialMinorCreditorSummaryListSetup(): void {
    // Strip index suffix and initialize minorCreditorData
    this.removeIndexFromData(this.minorCreditor);

    // Populate information for summary list
    this.setupMinorCreditorSummaryListData();
  }

  /**
   * Removes the index from the data object by assigning values from the input object to the corresponding keys in `minorCreditorData`.
   * The keys in `minorCreditorData` are constructed by appending the index as a suffix to the original keys.
   * If a key with the suffix exists in the input object, its value is assigned to the corresponding key in `minorCreditorData` without the suffix.
   *
   * @param data - The input object containing the keys with suffixes.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeIndexFromData(data: { [key: string]: any }) {
    // Iterate over each key in the IFinesMacOffenceDetailsMinorCreditorState interface
    Object.keys(this.minorCreditorData).forEach((key) => {
      const keyWithSuffix = `${key}_${this.index}`; // Construct the key with the suffix (e.g., key_0)
      if (data[keyWithSuffix] !== undefined) {
        // Assign the value from the input object, removing the suffix
        this.minorCreditorData[key as keyof IFinesMacOffenceDetailsMinorCreditorState] = data[keyWithSuffix];
      }
    });
  }

  /**
   * Sets up the data for the minor creditor summary list.
   * This method retrieves the name, address, and payment details.
   */
  private setupMinorCreditorSummaryListData(): void {
    this.getName();
    this.getAddress();
    this.getPaymentDetails();
  }

  /**
   * Retrieves the name based on the minor creditor data.
   * If the creditor type is 'individual', it concatenates the forenames and surname.
   * If the creditor type is not 'individual', it returns the company name.
   */
  private getName(): void {
    const {
      fm_offence_details_minor_creditor_creditor_type: type,
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
      fm_offence_details_minor_creditor_company_name: companyName,
    } = this.minorCreditorData;
    this.name = type === 'individual' ? `${forenames ?? ''} ${surname ?? ''}`.trim() : (companyName ?? '');
  }

  /**
   * Retrieves the address from the `minorCreditorData` object and constructs it as a string.
   * The constructed address includes non-null lines joined with newlines.
   */
  private getAddress(): void {
    const {
      fm_offence_details_minor_creditor_address_line_1: addressLine1,
      fm_offence_details_minor_creditor_address_line_2: addressLine2,
      fm_offence_details_minor_creditor_address_line_3: addressLine3,
      fm_offence_details_minor_creditor_post_code: postCode,
    } = this.minorCreditorData;

    this.address = [addressLine1, addressLine2, addressLine3, postCode].filter((line) => line).join('\n');

    if (this.address.length === 0) {
      this.address = FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultNotProvided;
    }
  }

  /**
   * Retrieves the payment details from the `minorCreditorData` object and assigns them to the corresponding properties.
   * If `hasPaymentDetails` is true, the payment details are assigned to the properties. Otherwise, the properties are left empty.
   */
  private getPaymentDetails(): void {
    const {
      fm_offence_details_minor_creditor_has_payment_details: hasPaymentDetails,
      fm_offence_details_minor_creditor_name_on_account: nameOnAccount,
      fm_offence_details_minor_creditor_sort_code: sortCode,
      fm_offence_details_minor_creditor_account_number: accountNumber,
      fm_offence_details_minor_creditor_payment_reference: paymentReference,
    } = this.minorCreditorData;
    this.paymentMethod = hasPaymentDetails
      ? FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultPaymentMethod
      : FinesMacOffenceDetailsAddAnOffenceFormMinorCreditorSummaryList.defaultNotProvided;
    this.accountName = nameOnAccount ?? '';
    this.sortCode = sortCode ? this.utilsService.formatSortCode(sortCode) : '';
    this.accountNumber = accountNumber ?? '';
    this.paymentReference = paymentReference ?? '';
  }

  ngOnInit(): void {
    this.initialMinorCreditorSummaryListSetup();
  }
}
