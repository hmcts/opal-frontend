import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import {
  IOpalFinesCourt,
  IOpalFinesCourtRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import {
  IOpalFinesLocalJusticeArea,
  IOpalFinesLocalJusticeAreaRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IFinesMacFixedPenaltyDetailsStoreState } from '../../fines-mac-fixed-penalty-details/interfaces/fines-mac-fixed-penalty-details-store-state.interface';
import { FINES_MAC_ACCOUNT_TYPES_KEYS } from '../../constants/fines-mac-account-types-keys';
import {
  IOpalFinesProsecutor,
  IOpalFinesProsecutorRefData,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';

@Component({
  selector: 'app-fines-mac-review-account-court-details',
  imports: [
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
  ],
  templateUrl: './fines-mac-review-account-court-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountCourtDetailsComponent implements OnInit {
  @Input({ required: true }) public courtDetails!: IFinesMacCourtDetailsState;
  @Input({ required: true }) public enforcementCourtsData!: IOpalFinesCourtRefData;
  @Input({ required: true }) public localJusticeAreasData!: IOpalFinesLocalJusticeAreaRefData;
  @Input({ required: true }) public prosecutorsData!: IOpalFinesProsecutorRefData;
  @Input({ required: false }) public fixedPenaltyDetails!: IFinesMacFixedPenaltyDetailsStoreState;
  @Input({ required: false }) public isReadOnly = false;
  @Input({ required: true }) public accountType!: string;
  @Output() public emitChangeCourtDetails = new EventEmitter<void>();

  private readonly opalFinesService = inject(OpalFines);
  public enforcementCourt!: string;
  public sendingCourt!: string | null;
  public prosecutor!: string | null;
  public issuingAuthority!: string | null;
  public accountTypesKeys = FINES_MAC_ACCOUNT_TYPES_KEYS;
  public cardTitle = 'Court Details';

  /**
   * Retrieves the enforcement court details based on the court ID from the court details.
   * It finds the corresponding court from the enforcement courts data and sets the
   * enforcement court property with a pretty name of the court.
   *
   * @private
   * @method getEnforcementCourt
   * @returns {void}
   */
  private getEnforcementCourt(): void {
    const court = this.enforcementCourtsData.refData.find(
      (court: IOpalFinesCourt) => court.court_id === +this.courtDetails.fm_court_details_imposing_court_id!,
    )!;

    this.enforcementCourt = this.opalFinesService.getCourtPrettyName(court);
  }

  /**
   * Retrieves the sending court details based on the originator ID from the court details.
   * It finds the corresponding local justice area from the localJusticeAreasData array
   * and returns the pretty name for that LJA or null if not found.
   *
   * @private
   * @returns {string | null}
   */
  private getSendingCourt(idLocationInStore: string | null): string | null {
    const lja = this.localJusticeAreasData.refData.find(
      (lja: IOpalFinesLocalJusticeArea) => lja.local_justice_area_id === +idLocationInStore!,
    )!;

    if (!lja) {
      return null;
    }
    return this.opalFinesService.getLocalJusticeAreaPrettyName(lja);
  }

  /**
   * Retrieves the prosecutor details based on the originator ID from the fixed penalty details.
   * It finds the corresponding prosecutor from the prosecutorsData array
   * and returns the pretty name for that prosecutor or null if not found.
   *
   * @private
   * @returns {string | null}
   */
  private getProsecutor(): string | null {
    const prosecutor = this.prosecutorsData.refData.find(
      (p: IOpalFinesProsecutor) => p.prosecutor_id === +this.fixedPenaltyDetails.fm_court_details_issuing_authority_id!,
    )!;

    if (!prosecutor) {
      return null;
    }
    return this.opalFinesService.getProsecutorPrettyName(prosecutor);
  }

  /**
   * Retrieves and processes the court details data.
   * This method calls the `getEnforcementCourt` function to fetch the enforcement court details
   * and sets the `sendingCourt` (and `issuingAuthority` if required), based on the originator ID from the relevant store
   * @private
   */
  private getCourtDetailsData(): void {
    this.getEnforcementCourt();
    if (this.accountType === this.accountTypesKeys.fixedPenalty) {
      this.issuingAuthority =
        this.getProsecutor() ?? this.getSendingCourt(this.fixedPenaltyDetails.fm_court_details_issuing_authority_id);
    } else {
      this.sendingCourt = this.getSendingCourt(this.courtDetails.fm_court_details_originator_id);
    }
  }

  /**
   * Sets the card title based on the account type.
   * If the account type is a fixed penalty, it sets the title to 'Issuing authority and court details',
   * otherwise it sets it to 'Court details'.
   *
   * @private
   */
  private setCardTitle(): void {
    if (this.accountType === this.accountTypesKeys.fixedPenalty) {
      this.cardTitle = 'Issuing authority and court details';
    } else {
      this.cardTitle = 'Court details';
    }
  }

  /**
   * Emits an event to indicate that court details needs changed.
   * This method triggers the `emitChangeCourtDetails` event emitter.
   */
  public changeCourtDetails(): void {
    this.emitChangeCourtDetails.emit();
  }

  public ngOnInit(): void {
    this.getCourtDetailsData();
    this.setCardTitle();
  }
}
