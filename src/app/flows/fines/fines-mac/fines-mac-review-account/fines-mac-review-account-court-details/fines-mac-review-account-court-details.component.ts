import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListRowComponent,
  GovukSummaryListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { IFinesMacCourtDetailsState } from '../../fines-mac-court-details/interfaces/fines-mac-court-details-state.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourt } from '@services/fines/opal-fines-service/interfaces/opal-fines-court.interface';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';
import { IOpalFinesLocalJusticeArea } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area.interface';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { IOpalFinesProsecutor } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor.interface';
import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';
import { FINES_ACCOUNT_TYPES } from '../../../constants/fines-account-types.constant';
import { FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE } from '../../constants/fines-mac-court-details-copy.constant';
import { IFinesMacCourtDetailsCopy } from '../../interfaces/fines-mac-court-details-copy.interface';
import { IFinesAccountTypes } from '../../../interfaces/fines-account-types.interface';

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
  private readonly opalFinesService = inject(OpalFines);

  @Input({ required: true }) public courtDetails!: IFinesMacCourtDetailsState;
  @Input({ required: true }) public enforcementCourtsData!: IOpalFinesCourtRefData;
  @Input({ required: true }) public localJusticeAreasData!: IOpalFinesLocalJusticeAreaRefData;
  @Input({ required: true }) public prosecutorsData!: IOpalFinesProsecutorRefData;
  @Input({ required: true }) public release1a1_1Enabled!: boolean;
  @Input({ required: false }) public isReadOnly = false;
  @Input({ required: true }) public accountType!: string;
  @Output() public emitChangeCourtDetails = new EventEmitter<void>();
  public enforcementCourt!: string;
  public sendingCourt!: string | null;
  public prosecutor!: string | null;
  public issuingAuthority!: string | null;
  public accountTypesKeys = FINES_ACCOUNT_TYPES;

  public get courtDetailsCopy(): IFinesMacCourtDetailsCopy {
    const accountTypeKey = this.accountType as keyof IFinesAccountTypes;

    return (
      FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE[accountTypeKey] ?? FINES_MAC_COURT_DETAILS_COPY_BY_ACCOUNT_TYPE.Fine
    );
  }

  public get cardTitle(): string {
    return this.courtDetailsCopy.reviewCardTitle;
  }

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
   * Retrieves the prosecutor details for the selected originator ID.
   * It finds the corresponding prosecutor from the prosecutorsData array
   * and returns the pretty name used by Fixed Penalty and Conditional Caution reviews,
   * or null if no prosecutor matches.
   *
   * @private
   * @returns {string | null}
   */
  private getProsecutor(): string | null {
    const prosecutor = this.prosecutorsData.ref_data.find(
      (p: IOpalFinesProsecutor) => p.prosecutor_id === +this.courtDetails.fm_court_details_originator_id!,
    )!;

    if (!prosecutor) {
      return null;
    }
    return this.opalFinesService.getProsecutorPrettyName(prosecutor);
  }

  /**
   * Resolves an originator when its numeric ID exists in both the prosecutor and LJA datasets.
   * The persisted originator name identifies which dataset supplied the original selection.
   *
   * @param originatorId - The persisted originator ID.
   * @param storedOriginatorName - The persisted raw originator name.
   * @returns The matching formatted originator name, or null when the ID is not ambiguous or the name does not match.
   */
  private getOriginatorForOverlappingId(
    originatorId: string | null,
    storedOriginatorName: string | null,
  ): string | null {
    if (!originatorId || !storedOriginatorName) {
      return null;
    }

    const originatorIdNumber = +originatorId;
    const prosecutor = this.prosecutorsData.ref_data.find(
      (item: IOpalFinesProsecutor) => item.prosecutor_id === originatorIdNumber,
    );
    const localJusticeArea = this.localJusticeAreasData.refData.find(
      (item: IOpalFinesLocalJusticeArea) => item.local_justice_area_id === originatorIdNumber,
    );

    if (!prosecutor || !localJusticeArea) {
      return null;
    }
    if (prosecutor.name === storedOriginatorName) {
      return this.opalFinesService.getProsecutorPrettyName(prosecutor);
    }
    if (localJusticeArea.name === storedOriginatorName) {
      return this.opalFinesService.getLocalJusticeAreaPrettyName(localJusticeArea);
    }
    return null;
  }

  /**
   * Resolves the enforcement court and account-type-specific originator display values.
   * Fine sending courts always use local justice areas. When release-1a-1-1 is enabled,
   * Fixed Penalty and Conditional Caution originators prefer prosecutors. When it is disabled,
   * Fixed Penalty retains its prosecutor-first lookup and Conditional Caution prefers local justice areas.
   * When an ID exists in both datasets, the stored originator name disambiguates the selection.
   * Both flag-aware account types otherwise fall back to the other reference dataset and then
   * the stored originator name so persisted drafts remain visible across flag transitions.
   * @private
   */
  private getCourtDetailsData(): void {
    const originatorId = this.courtDetails.fm_court_details_originator_id;
    const storedOriginatorName = this.courtDetails.fm_court_details_originator_name;
    const overlappingOriginator = this.getOriginatorForOverlappingId(originatorId, storedOriginatorName);

    this.getEnforcementCourt();
    if (this.accountType === this.accountTypesKeys['Fixed Penalty']) {
      this.issuingAuthority =
        overlappingOriginator ?? this.getProsecutor() ?? this.getSendingCourt(originatorId) ?? storedOriginatorName;
    } else if (this.accountType === this.accountTypesKeys['Conditional Caution']) {
      if (this.release1a1_1Enabled) {
        this.sendingCourt =
          overlappingOriginator ?? this.getProsecutor() ?? this.getSendingCourt(originatorId) ?? storedOriginatorName;
      } else {
        this.sendingCourt =
          overlappingOriginator ?? this.getSendingCourt(originatorId) ?? this.getProsecutor() ?? storedOriginatorName;
      }
    } else {
      this.sendingCourt = this.getSendingCourt(originatorId);
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
  }
}
