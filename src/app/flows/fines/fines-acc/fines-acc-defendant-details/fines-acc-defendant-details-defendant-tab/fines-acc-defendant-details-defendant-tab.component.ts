import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_TEXT } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-text.constant';
import { FinesAccPartyDetails } from '../fines-acc-party-details/fines-acc-party-details.component';
import { IFinesAccDefendantDetailsConvertAction } from '../interfaces/fines-acc-defendant-details-convert-action.interface';
import { RouterLink } from '@angular/router';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-defendant-tab',
  imports: [FinesAccPartyDetails, RouterLink],
  templateUrl: './fines-acc-defendant-details-defendant-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsDefendantTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() hasAccountMaintenancePermissionInBU: boolean = false;
  @Input() canAddParentOrGuardianDetails: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  /**
   * Builds the convert action metadata for the current defendant.
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

  /**
   * Determines the target URL for the "Change" link based on the user's BU permission.
   */
  public changeDefendantDetailsLink(): string {
    const partyType = this.tabData.defendant_account_party.party_details.organisation_flag
      ? FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY
      : FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL;

    return this.hasAccountMaintenancePermissionInBU
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${partyType}/amend`
      : '/access-denied';
  }

  /**
   * Determines the target URL for the convert action based on the user's BU permission.
   */
  public convertAccountLink(): string {
    return this.hasAccountMaintenancePermissionInBU && this.convertAction?.interactive && this.convertAction.partyType
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.convert}/${this.convertAction.partyType}`
      : '/access-denied';
  }

  /**
   * Determines the target URL for the add parent/guardian action based on the user's BU permission.
   */
  public addParentOrGuardianDetailsLink(): string {
    return this.hasAccountMaintenancePermissionInBU && this.addParentOrGuardianAction
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN}/add`
      : '/access-denied';
  }
}
