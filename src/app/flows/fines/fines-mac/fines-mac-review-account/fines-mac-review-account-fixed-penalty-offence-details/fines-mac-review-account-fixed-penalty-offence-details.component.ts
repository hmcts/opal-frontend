import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { FinesMacReviewAccountNotProvidedComponent } from '../fines-mac-review-account-not-provided/fines-mac-review-account-not-provided.component';
import { FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES } from '../constants/fines-mac-review-account-default-values.constant';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_MAC_OFFENCE_TYPES } from '../../constants/fines-mac-offence-types';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-mac-review-account-fixed-penalty-offence-details',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesMacReviewAccountNotProvidedComponent,
  ],
  templateUrl: './fines-mac-review-account-fixed-penalty-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent implements OnInit {
  @Input({ required: true }) public offenceDetails!: IFinesMacFixedPenaltyDetailsStoreState;
  @Input({ required: false }) public isReadOnly = false;
  @Output() public emitChangeOffenceDetails = new EventEmitter<void>();
  private readonly dateService = new DateService();
  private readonly opalFinesService = inject(OpalFines);
  private readonly utilsService = inject(UtilsService);

  public readonly defaultValues = FINES_MAC_REVIEW_ACCOUNT_DEFAULT_VALUES;
  public readonly offenceTypes = FINES_MAC_OFFENCE_TYPES;
  public offence!: string;

  /**
   * Formats the date from 'dd/MM/yyyy' to 'dd MMMM yyyy'.
   * This method uses the DateService to convert the date format.
   *
   * @param {string} date - The date string in 'dd/MM/yyyy' format.
   * @returns {string} - The formatted date string in 'dd MMMM yyyy' format.
   */
  public dateFormat(date: string): string {
    return this.dateService.getFromFormatToFormat(date, 'dd/MM/yyyy', 'dd MMMM yyyy')
  }

  /**
   * Returns the offence type based on the provided key.
   * If the key does not match any known offence type, it returns the key itself.
   *
   * @param {string} offenceType - The key of the offence type.
   * @returns {string} - The formatted offence type or the original key if not found.
   */
  public offenceType(offenceType: string ): string {
    return this.offenceTypes[offenceType as keyof typeof this.offenceTypes] || offenceType;
  }

  /**
   * Retrieves the offence details based on the provided offence code.
   * It uses the OpalFines service to fetch the offence details and updates the `offence` property.
   *
   * @param {string | null} offenceCode - The CJS code of the offence.
   */
  public getOffence(offenceCode: string | null): void {
    if (offenceCode) {
      this.opalFinesService.getOffenceByCjsCode(offenceCode).subscribe(
        (offence: IOpalFinesOffencesRefData ) => {
          this.offence = `${offence.refData[0].offence_title} (${offenceCode})`;
        }
      );
    } else {
      this.offence = `Offence not found (${offenceCode})`;
    }
  }

  /**
  * Converts the amount imposed to a monetary string format.
   *
   * @param {string | null} amount - The amount that needs to be converting.
   */
  public toMonetaryString(amount: string | null): string | null {
    if (amount) {
      return this.utilsService.convertToMonetaryString(amount);
    } else {
      return amount;
    }
  }

  /**
   * Emits an event to indicate that contact details needs changed.
   * This method triggers the `emitChangeOffenceDetails` event emitter.
   */
  public changeOffenceDetails(): void {
    this.emitChangeOffenceDetails.emit();
  }

  public ngOnInit(): void {
    this.getOffence(this.offenceDetails.fm_offence_details_offence_cjs_code);
  }

}
