import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacEmployerDetailsState } from '../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';

@Component({
  selector: 'app-fines-mac-review-account-employer-details',
  standalone: true,
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-employer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountEmployerDetailsComponent implements OnInit {
  @Input({ required: true }) public employerDetails!: IFinesMacEmployerDetailsState;
  @Output() public emitChangeEmployerDetails = new EventEmitter<void>();

  private readonly utilsService = inject(UtilsService);

  public readonly defaultValues = FinesMacReviewAccountDefaultValues;
  public employerAddress!: string | null;

  /**
   * Retrieves the employer address data from the employer details and formats it.
   * The formatted address is stored in the `employerAddress` property.
   * The address lines and post code are joined with a `<br>` separator.
   *
   * @private
   * @returns {void}
   */
  private getEmployerAddressData(): void {
    const {
      fm_employer_details_employer_address_line_1,
      fm_employer_details_employer_address_line_2,
      fm_employer_details_employer_address_line_3,
      fm_employer_details_employer_address_line_4,
      fm_employer_details_employer_address_line_5,
      fm_employer_details_employer_post_code,
    } = this.employerDetails;

    this.employerAddress = this.utilsService.formatAddress(
      [
        fm_employer_details_employer_address_line_1,
        fm_employer_details_employer_address_line_2,
        fm_employer_details_employer_address_line_3,
        fm_employer_details_employer_address_line_4,
        fm_employer_details_employer_address_line_5,
        fm_employer_details_employer_post_code,
      ],
      '<br>',
    );
  }

  /**
   * Retrieves the employer details data.
   * This method internally calls `getEmployerAddressData` to fetch the employer's address information.
   *
   * @private
   */
  private getEmployerDetailsData(): void {
    this.getEmployerAddressData();
  }

  /**
   * Emits an event to indicate that employer details needs changed.
   * This method triggers the `emitChangeEmployerDetails` event emitter.
   */
  public changeEmployerDetails(): void {
    this.emitChangeEmployerDetails.emit();
  }

  public ngOnInit(): void {
    this.getEmployerDetailsData();
  }
}
