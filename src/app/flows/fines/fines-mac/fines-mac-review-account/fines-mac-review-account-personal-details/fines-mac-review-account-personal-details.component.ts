import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacPersonalDetailsState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-state.interface';
import { IFinesMacPersonalDetailsAliasState } from '../../fines-mac-personal-details/interfaces/fines-mac-personal-details-alias-state.interface';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';
import { FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES } from '../constants/fines-mac-review-account-default-values.constant';

@Component({
  selector: 'app-fines-mac-review-account-personal-details',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-personal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountPersonalDetailsComponent implements OnInit {
  @Input({ required: true }) public personalDetails!: IFinesMacPersonalDetailsState;
  @Input({ required: false }) public showVehicleDetails: boolean = true;
  @Output() public emitChangePersonalDetails = new EventEmitter<void>();

  private readonly dateService = inject(DateService);
  private readonly utilsService = inject(UtilsService);

  public readonly defaultValues = FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES;
  public aliases!: string[];
  public dob!: string | null;
  public address!: string[];

  /**
   * Retrieves and formats alias data from the personal details.
   * The aliases are extracted from the `fm_personal_details_aliases` property,
   * concatenated into a single string with forenames and surnames
   *
   * @private
   * @returns {void}
   */
  private getAliasesData(): void {
    this.aliases = this.personalDetails.fm_personal_details_aliases.map((item) => {
      const forenameKey = Object.keys(item).find((key) =>
        key.includes('forenames'),
      ) as keyof IFinesMacPersonalDetailsAliasState;
      const surnameKey = Object.keys(item).find((key) =>
        key.includes('surname'),
      ) as keyof IFinesMacPersonalDetailsAliasState;

      return `${item[forenameKey]} ${item[surnameKey]}`.trim();
    });
  }

  /**
   * Retrieves and formats the date of birth data from the personal details.
   * If the date of birth is available, it converts the date to a specific format,
   * calculates the age, and sets the formatted date of birth along with an age category
   * (either 'Adult' or 'Youth') to the `dob` property.
   *
   * @private
   * @returns {void}
   */
  private getDateOfBirthData(): void {
    if (this.personalDetails.fm_personal_details_dob) {
      const dob = this.personalDetails.fm_personal_details_dob;
      const age = this.dateService.calculateAge(dob);
      this.dob = `${this.dateService.getFromFormatToFormat(dob, 'dd/MM/yyyy', 'dd MMMM yyyy')} (${age >= 18 ? 'Adult' : 'Youth'})`;
    }
  }

  /**
   * Retrieves and formats the address data from the personal details.
   * The formatted address is stored in the `address` property.
   *
   * @private
   */
  private getAddressData(): void {
    const {
      fm_personal_details_address_line_1,
      fm_personal_details_address_line_2,
      fm_personal_details_address_line_3,
      fm_personal_details_post_code,
    } = this.personalDetails;

    this.address = this.utilsService.formatAddress([
      fm_personal_details_address_line_1,
      fm_personal_details_address_line_2,
      fm_personal_details_address_line_3,
      fm_personal_details_post_code,
    ]);
  }

  /**
   * Retrieves and processes personal details data by invoking methods to get aliases, date of birth, and address data.
   *
   * @private
   */
  private getPersonalDetailsData(): void {
    this.getAliasesData();
    this.getDateOfBirthData();
    this.getAddressData();
  }

  /**
   * Emits an event to indicate that personal details needs changed.
   * This method triggers the `emitChangePersonalDetails` event emitter.
   */
  public changePersonalDetails(): void {
    this.emitChangePersonalDetails.emit();
  }

  public ngOnInit(): void {
    this.getPersonalDetailsData();
  }
}
