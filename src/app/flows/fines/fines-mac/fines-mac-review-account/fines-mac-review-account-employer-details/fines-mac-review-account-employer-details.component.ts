import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IFinesMacEmployerDetailsState } from '../../fines-mac-employer-details/interfaces/fines-mac-employer-details-state.interface';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';
import { FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES } from '../constants/fines-mac-review-account-default-values.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-mac-review-account-employer-details',
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
  @Input({ required: false }) public isReadOnly = false;
  @Output() public emitChangeEmployerDetails = new EventEmitter<void>();

  private readonly utilsService = inject(UtilsService);

  public readonly defaultValues = FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES;
  public employerAddress!: string[];

  /**
   * Retrieves the employer address data from the employer details and formats it.
   * The formatted address is stored in the `employerAddress` property.
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

    this.employerAddress = this.utilsService.formatAddress([
      fm_employer_details_employer_address_line_1,
      fm_employer_details_employer_address_line_2,
      fm_employer_details_employer_address_line_3,
      fm_employer_details_employer_address_line_4,
      fm_employer_details_employer_address_line_5,
      fm_employer_details_employer_post_code,
    ]);
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
