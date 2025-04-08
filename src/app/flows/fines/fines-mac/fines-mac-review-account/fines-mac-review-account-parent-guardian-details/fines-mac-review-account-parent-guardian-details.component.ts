import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';
import { IFinesMacParentGuardianDetailsState } from '../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-state.interface';
import { IFinesMacParentGuardianDetailsAliasState } from '../../fines-mac-parent-guardian-details/interfaces/fines-mac-parent-guardian-details-alias-state.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES } from '../constants/fines-mac-review-account-default-values.constant';
import { DateService, UtilsService } from '@hmcts/opal-frontend-common/services';

@Component({
  selector: 'app-fines-mac-review-account-parent-guardian-details',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-parent-guardian-details.component.html',
  styles: ``,
})
export class FinesMacReviewAccountParentGuardianDetailsComponent implements OnInit {
  @Input({ required: true }) public parentGuardianDetails!: IFinesMacParentGuardianDetailsState;
  @Input({ required: false }) public isReadOnly = false;
  @Output() public emitChangeParentGuardianDetails = new EventEmitter<void>();

  private readonly dateService = inject(DateService);
  private readonly utilsService = inject(UtilsService);

  public readonly defaultValues = FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES;
  public aliases!: string[];
  public dob!: string | null;
  public address!: string[];

  /**
   * Retrieves and formats alias data from the parent or guardian details.
   * The aliases are extracted from the `fm_parent_guardian_details_aliases` property,
   * concatenated into a single string with forenames and surnames
   *
   * @private
   * @returns {void}
   */
  private getAliasesData(): void {
    this.aliases = this.parentGuardianDetails.fm_parent_guardian_details_aliases.map((item) => {
      const forenameKey = Object.keys(item).find((key) =>
        key.includes('forenames'),
      ) as keyof IFinesMacParentGuardianDetailsAliasState;
      const surnameKey = Object.keys(item).find((key) =>
        key.includes('surname'),
      ) as keyof IFinesMacParentGuardianDetailsAliasState;

      return `${item[forenameKey]} ${item[surnameKey]}`.trim();
    });
  }

  /**
   * Retrieves and formats the date of birth data from the parent or guardian details.
   * If the date of birth is available, it converts the date to a specific format,
   * calculates the age, and sets the formatted date of birth along with an age category
   * (either 'Adult' or 'Youth') to the `dob` property.
   *
   * @private
   * @returns {void}
   */
  private getDateOfBirthData(): void {
    if (this.parentGuardianDetails.fm_parent_guardian_details_dob) {
      const dob = this.parentGuardianDetails.fm_parent_guardian_details_dob;
      this.dob = this.dateService.getFromFormatToFormat(dob, 'dd/MM/yyyy', 'dd MMMM yyyy');
    }
  }

  /**
   * Retrieves and formats the address data from the parent or guardian details.
   * The formatted address is stored in the `address` property.
   *
   * @private
   */
  private getAddressData(): void {
    const {
      fm_parent_guardian_details_address_line_1,
      fm_parent_guardian_details_address_line_2,
      fm_parent_guardian_details_address_line_3,
      fm_parent_guardian_details_post_code,
    } = this.parentGuardianDetails;

    this.address = this.utilsService.formatAddress([
      fm_parent_guardian_details_address_line_1,
      fm_parent_guardian_details_address_line_2,
      fm_parent_guardian_details_address_line_3,
      fm_parent_guardian_details_post_code,
    ]);
  }

  /**
   * Retrieves and processes parent or guardian details data by invoking methods to get aliases, date of birth, and address data.
   *
   * @private
   */
  private getParentGuardianData(): void {
    this.getAliasesData();
    this.getDateOfBirthData();
    this.getAddressData();
  }

  /**
   * Emits an event to indicate that parent or guardian details needs changed.
   * This method triggers the `emitChangeParentGuardianDetails` event emitter.
   */
  public changeParentGuardianDetails(): void {
    this.emitChangeParentGuardianDetails.emit();
  }

  public ngOnInit(): void {
    this.getParentGuardianData();
  }
}
