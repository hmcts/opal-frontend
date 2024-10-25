import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AbstractFormArrayRemovalComponent } from '@components/abstract/abstract-form-array-removal-base/abstract-form-array-removal-base';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FinesMacOffenceDetailsDefaultValues } from '../enums/fines-mac-offence-details-default-values.enum';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';

@Component({
  selector: 'app-fines-mac-offence-details-remove-minor-creditor',
  standalone: true,
  imports: [
    CommonModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
  ],
  templateUrl: './fines-mac-offence-details-remove-minor-creditor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsRemoveMinorCreditorComponent
  extends AbstractFormArrayRemovalComponent
  implements OnInit
{
  private readonly utilsService = inject(UtilsService);
  protected readonly finesService = inject(FinesService);
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);
  protected readonly fineMacOffenceDetailsRoutingPaths = FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS;

  private minorCreditor!: IFinesMacOffenceDetailsMinorCreditorForm;

  public name!: string;
  public address!: string;
  public paymentMethod!: string;
  public accountName!: string;
  public sortCode!: string;
  public accountNumber!: string;
  public paymentReference!: string;

  /**
   * Finds a minor creditor based on the imposition position.
   * @param impositionPosition - The imposition position to search for.
   * @returns The minor creditor form data matching the imposition position.
   */
  private findMinorCreditor(impositionPosition: number): IFinesMacOffenceDetailsMinorCreditorForm {
    return this.finesService.finesMacState.minorCreditors.find(
      (x) => x.formData.fm_offence_details_imposition_position === impositionPosition,
    )!;
  }

  /**
   * Retrieves the minor creditor data and sets the corresponding properties.
   */
  private getMinorCreditorData(): void {
    const impositionPosition = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor;
    this.minorCreditor = this.findMinorCreditor(impositionPosition!);

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
   * Finds the index of a minor creditor based on the imposition position.
   * @param impositionPosition The imposition position to search for.
   * @returns The index of the minor creditor, or -1 if not found.
   */
  private findMinorCreditorIndex(impositionPosition: number): number {
    return this.finesService.finesMacState.minorCreditors.findIndex(
      (x) => x.formData.fm_offence_details_imposition_position === impositionPosition,
    );
  }

  /**
   * Confirms the removal of a minor creditor from the fines Mac offence details.
   * If the minor creditor exists in the list, it will be removed.
   * After removal, it will navigate to the add offence page.
   */
  public confirmMinorCreditorRemoval(): void {
    const impositionPosition = this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor!;
    const index = this.findMinorCreditorIndex(impositionPosition);

    if (index !== -1) {
      this.finesService.finesMacState.minorCreditors.splice(index, 1);
    }

    this.handleRoute(this.fineMacOffenceDetailsRoutingPaths.children.addOffence);
  }

  public ngOnInit(): void {
    this.getMinorCreditorData();
  }
}
