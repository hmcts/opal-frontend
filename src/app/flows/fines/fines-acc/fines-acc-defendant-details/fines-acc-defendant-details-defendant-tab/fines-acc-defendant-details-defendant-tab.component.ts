import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-text.constant';
import { FinesAccPartyDetails } from '../fines-acc-party-details/fines-acc-party-details.component';
import { IFinesAccDefendantDetailsConvertAction } from '../interfaces/fines-acc-defendant-details-convert-action.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-defendant-tab',
  imports: [FinesAccPartyDetails],
  templateUrl: './fines-acc-defendant-details-defendant-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsDefendantTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() canAddParentOrGuardianDetails: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeDefendantDetails = new EventEmitter<string>();
  @Output() convertAccount = new EventEmitter<string>();
  @Output() addParentOrGuardianDetails = new EventEmitter<string>();

  /**
   * Emits the current defendant party type for the convert-account journey.
   *
   * The click originates from an anchor element, so the browser default
   * navigation is prevented before emitting the event to the parent container.
   *
   * @param event - The click event from the action link.
   */
  public get convertAction(): IFinesAccDefendantDetailsConvertAction | null {
    if (!this.hasAccountMaintenencePermission || !this.tabData.defendant_account_party.is_debtor) {
      return null;
    }

    const targetPartyType = this.tabData.defendant_account_party.party_details.organisation_flag
      ? FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL
      : FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY;

    return {
      interactive: true,
      label: FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT[targetPartyType].convertActionLabel,
      partyType: targetPartyType,
    };
  }

  /**
   * Determines whether the add parent/guardian action should be available.
   */
  public get addParentOrGuardianAction(): boolean {
    return this.hasAccountMaintenencePermission && this.canAddParentOrGuardianDetails;
  }

  public handleConvertAccount(event?: Event): void {
    event?.preventDefault();
    if (this.convertAction?.interactive) {
      this.convertAccount.emit(this.convertAction.partyType);
    }
  }

  /**
   * Emits the current defendant party type for the shared party-details flow.
   *
   * The click originates from an anchor element, so the browser default
   * navigation is prevented before emitting the event to the parent container.
   *
   * @param event - The click event from the action link.
   */
  public handleChangeDefendantDetails(event?: Event): void {
    event?.preventDefault();

    if (this.tabData.defendant_account_party.party_details.organisation_flag) {
      this.changeDefendantDetails.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY);
    } else {
      this.changeDefendantDetails.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL);
    }
  }

  /**
   * Emits the parent-or-guardian party type for the add-details journey.
   *
   * The click originates from an anchor element, so the browser default
   * navigation is prevented before emitting the event to the parent container.
   *
   * @param event - The click event from the action link.
   */
  public handleAddParentOrGuardianDetails(event?: Event): void {
    event?.preventDefault();
    if (this.addParentOrGuardianAction) {
      this.addParentOrGuardianDetails.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN);
    }
  }
}
