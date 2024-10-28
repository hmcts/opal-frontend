import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsDefaultValues } from '../enums/fines-mac-offence-details-default-values.enum';
import { CommonModule } from '@angular/common';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryCardActionComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-action/govuk-summary-card-action.component';
import { GovukSummaryListRowActionItemComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-action-item/govuk-summary-list-row-action-item.component';
import { GovukSummaryListRowActionsComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row-actions/govuk-summary-list-row-actions.component';

@Component({
  selector: 'app-fines-mac-offence-details-minor-creditor-information',
  standalone: true,
  imports: [
    CommonModule,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardListComponent,
    GovukSummaryListRowActionsComponent,
    GovukSummaryListRowActionItemComponent,
    GovukSummaryCardActionComponent,
  ],
  templateUrl: './fines-mac-offence-details-minor-creditor-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsMinorCreditorInformationComponent implements OnInit {
  @Input({ required: true }) public minorCreditor!: IFinesMacOffenceDetailsMinorCreditorForm;
  @Input({ required: false }) public showActions!: boolean;
  @Output() public actionClicked = new EventEmitter<{ action: string; index: number }>();

  private readonly utilsService = inject(UtilsService);

  public name!: string;
  public address!: string;
  public paymentMethod!: string;
  public accountName!: string;
  public sortCode!: string;
  public accountNumber!: string;
  public paymentReference!: string;

  /**
   * Retrieves the minor creditor information and sets the corresponding properties.
   */
  private getMinorCreditorInformation(): void {
    this.setName();
    this.setAddress();
    this.setPaymentDetails();
  }

  /**
   * Retrieves the individual's full name from the minor creditor form data.
   * If the forenames are not provided, an empty string is used.
   * Trims any leading or trailing whitespace from the full name.
   *
   * @returns The individual's full name.
   */
  private getIndividualName(): string {
    const {
      fm_offence_details_minor_creditor_forenames: forenames,
      fm_offence_details_minor_creditor_surname: surname,
    } = this.minorCreditor.formData;

    return `${forenames ?? ''} ${surname}`.trim();
  }

  /**
   * Retrieves the company name from the form data of the minor creditor.
   * @returns The company name.
   */
  private getCompanyName(): string {
    return this.minorCreditor.formData.fm_offence_details_minor_creditor_company_name!;
  }

  /**
   * Sets the name based on the creditor type.
   */
  private setName(): void {
    const { fm_offence_details_minor_creditor_creditor_type: creditorType } = this.minorCreditor.formData;

    this.name = creditorType === 'individual' ? this.getIndividualName() : this.getCompanyName();
  }

  /**
   * Formats the address lines into a single string with line breaks.
   *
   * @param addressLines - An array of address lines.
   * @returns The formatted address string with line breaks.
   */
  private formatAddress(addressLines: (string | null)[]): string {
    const formattedAddress = addressLines.filter((line) => line).join('<br>');
    return formattedAddress.length > 0 ? formattedAddress : FinesMacOffenceDetailsDefaultValues.defaultNotProvided;
  }

  /**
   * Sets the address based on the form data of the minor creditor.
   */
  private setAddress(): void {
    const {
      fm_offence_details_minor_creditor_address_line_1: addressLine1,
      fm_offence_details_minor_creditor_address_line_2: addressLine2,
      fm_offence_details_minor_creditor_address_line_3: addressLine3,
      fm_offence_details_minor_creditor_post_code: postCode,
    } = this.minorCreditor.formData;

    this.address = this.formatAddress([addressLine1, addressLine2, addressLine3, postCode]);
  }

  /**
   * Sets the default payment method.
   *
   * @returns The default payment method.
   */
  private setDefaultPaymentMethod(): string {
    return FinesMacOffenceDetailsDefaultValues.defaultPaymentMethod;
  }

  /**
   * Sets the default value for when a value is not provided.
   * @returns The default value for not provided.
   */
  private setDefaultNotProvided(): string {
    return FinesMacOffenceDetailsDefaultValues.defaultNotProvided;
  }

  /**
   * Formats the given sort code.
   *
   * @param sortCode - The sort code to be formatted.
   * @returns The formatted sort code.
   */
  private formatSortCode(sortCode: string | null): string {
    return sortCode ? this.utilsService.formatSortCode(sortCode) : '';
  }

  /**
   * Sets the payment details based on the form data of the minor creditor.
   * If the minor creditor has payment details, it sets the default payment method.
   * Otherwise, it sets the default not provided.
   */
  private setPaymentDetails(): void {
    const {
      fm_offence_details_minor_creditor_has_payment_details: hasPaymentDetails,
      fm_offence_details_minor_creditor_name_on_account: nameOnAccount,
      fm_offence_details_minor_creditor_sort_code: sortCode,
      fm_offence_details_minor_creditor_account_number: accountNumber,
      fm_offence_details_minor_creditor_payment_reference: paymentReference,
    } = this.minorCreditor.formData;

    this.paymentMethod = hasPaymentDetails ? this.setDefaultPaymentMethod() : this.setDefaultNotProvided();
    this.accountName = nameOnAccount ?? '';
    this.sortCode = this.formatSortCode(sortCode);
    this.accountNumber = accountNumber ?? '';
    this.paymentReference = paymentReference ?? '';
  }

  /**
   * Handles the click event on the summary list action.
   * @param event The event triggered by the click action.
   */
  public summaryListActionClick(action: string) {
    this.actionClicked.emit({ action, index: this.minorCreditor.formData.fm_offence_details_imposition_position! });
  }

  public ngOnInit(): void {
    this.getMinorCreditorInformation();
  }
}
