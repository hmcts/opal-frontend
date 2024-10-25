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
import { FinesService } from '@services/fines/fines-service/fines.service';

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
  @Input({ required: true }) public index!: number;

  private readonly finesService = inject(FinesService);
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
   * Sets up the initial minor creditor summary list.
   * Retrieves the minor creditor data from the fines service based on the imposition position,
   * and populates the information for the summary list.
   */
  private initialMinorCreditorSummaryListSetup(): void {
    this.minorCreditorData = this.finesService.finesMacState.minorCreditors.find(
      (x) => x.formData.fm_offence_details_imposition_position === this.index,
    )!.formData;

    // Populate information for summary list
    this.setupMinorCreditorSummaryListData();
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

    this.address = [addressLine1, addressLine2, addressLine3, postCode].filter((line) => line).join('<br>');

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
