import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IFinesMacCompanyDetailsState } from '../../fines-mac-company-details/interfaces/fines-mac-company-details-state.interface';
import { UtilsService } from '@services/utils/utils.service';
import { IFinesMacCompanyDetailsAliasState } from '../../fines-mac-company-details/interfaces/fines-mac-company-details-alias-state.interface';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';

@Component({
  selector: 'app-fines-mac-review-account-company-details',
  standalone: true,
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-company-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountCompanyDetailsComponent implements OnInit {
  @Input({ required: true }) public companyDetails!: IFinesMacCompanyDetailsState;
  @Output() public emitChangeCompanyDetails = new EventEmitter<void>();

  private readonly utilsService = inject(UtilsService);

  public aliases!: string[];
  public address!: string[];

  /**
   * Retrieves and formats alias data from the company details.
   * The aliases are extracted from the `fm_company_details_aliases` property,
   * concatenated into a single string with forenames and surnames
   *
   * @private
   * @returns {void}
   */
  private getAliasesData(): void {
    this.aliases = this.companyDetails.fm_company_details_aliases.map((item) => {
      const organisationNameKey = Object.keys(item).find((key) =>
        key.includes('organisation_name'),
      ) as keyof IFinesMacCompanyDetailsAliasState;

      return `${item[organisationNameKey]}`.trim();
    });
  }

  /**
   * Retrieves and formats the address data from the company details.
   * The formatted address is stored in the `address` property.
   *
   * @private
   */
  private getAddressData(): void {
    const {
      fm_company_details_address_line_1,
      fm_company_details_address_line_2,
      fm_company_details_address_line_3,
      fm_company_details_postcode,
    } = this.companyDetails;

    this.address = this.utilsService.formatAddress([
      fm_company_details_address_line_1,
      fm_company_details_address_line_2,
      fm_company_details_address_line_3,
      fm_company_details_postcode,
    ]);
  }

  /**
   * Retrieves and processes company details data by invoking methods to get aliases, and address data.
   *
   * @private
   */
  private getCompanyData(): void {
    this.getAliasesData();
    this.getAddressData();
  }

  /**
   * Emits an event to indicate that company details needs changed.
   * This method triggers the `emitChangeCompanyDetails` event emitter.
   */
  public changeCompanyDetails(): void {
    this.emitChangeCompanyDetails.emit();
  }

  public ngOnInit(): void {
    this.getCompanyData();
  }
}
