import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { FINES_MAC_FIXED_PENALTY_OFFENCE_TYPES } from '../../fines-mac-fixed-penalty-details/constants/fines-mac-fixed-penalty-offence-types';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesOffencesRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';

@Component({
  selector: 'app-fines-mac-review-account-fixed-penalty-offence-details',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
    FinesNotProvidedComponent,
    DateFormatPipe,
    MonetaryPipe,
  ],
  templateUrl: './fines-mac-review-account-fixed-penalty-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountFixedPenaltyOffenceDetailsComponent implements OnInit {
  private readonly opalFinesService = inject(OpalFines);
  @Input({ required: true }) public offenceDetails!: IFinesMacFixedPenaltyDetailsStoreState;
  @Input({ required: false }) public isReadOnly = false;
  @Output() public emitChangeOffenceDetails = new EventEmitter<void>();

  public readonly defaultValues = FINES_DEFAULT_VALUES;
  public readonly offenceTypes = FINES_MAC_FIXED_PENALTY_OFFENCE_TYPES;
  public offence!: string;

  /**
   * Returns the offence type based on the provided key.
   *
   * @param {string} offenceType - The key of the offence type.
   * @returns {string} - The formatted offence type or the original key if not found.
   */
  public offenceType(offenceType: string): string {
    return this.offenceTypes[offenceType as keyof typeof this.offenceTypes];
  }

  /**
   * Retrieves the offence details based on the provided offence code.
   * It uses the OpalFines service to fetch the offence details and updates the `offence` property.
   *
   * @param {string} offenceCode - The CJS code of the offence.
   */
  public getOffence(offenceCode: string): void {
    this.opalFinesService.getOffenceByCjsCode(offenceCode).subscribe((offence: IOpalFinesOffencesRefData) => {
      this.offence = `${offence.refData[0].offence_title} (${offenceCode})`;
    });
  }

  /**
   * Emits an event to indicate that contact details needs changed.
   * This method triggers the `emitChangeOffenceDetails` event emitter.
   */
  public changeOffenceDetails(): void {
    this.emitChangeOffenceDetails.emit();
  }

  public ngOnInit(): void {
    this.getOffence(this.offenceDetails.fm_offence_details_offence_cjs_code!);
  }
}
