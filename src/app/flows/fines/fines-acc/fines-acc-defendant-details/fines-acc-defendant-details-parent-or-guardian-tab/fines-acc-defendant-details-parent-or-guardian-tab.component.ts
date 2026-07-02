import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FinesAccPartyDetails } from '../fines-acc-party-details/fines-acc-party-details.component';
import { RouterLink } from '@angular/router';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS } from '../../fines-acc-remove-non-paying-pg/constants/fines-acc-remove-non-paying-pg-routing-paths.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-parent-or-guardian-tab',
  imports: [FinesAccPartyDetails, RouterLink],
  templateUrl: './fines-acc-defendant-details-parent-or-guardian-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsParentOrGuardianTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty | null;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() hasAccountMaintenancePermissionInBU: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;

  /**
   * Determines whether the remove parent or guardian action should be available.
   */
  public get removeParentOrGuardianAction(): boolean {
    return this.hasAccountMaintenencePermission && this.tabData?.defendant_account_party.is_debtor === false;
  }

  /**
   * Determines the target URL for the "Change" link based on the user's BU permission.
   */
  public changeParentOrGuardianDetailsLink(): string {
    return this.hasAccountMaintenancePermissionInBU
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.party}/${FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.PARENT_GUARDIAN}/amend`
      : '/access-denied';
  }

  /**
   * Determines the target URL for the remove parent or guardian action based on the user's BU permission.
   */
  public removeParentOrGuardianDetailsLink(): string {
    return this.hasAccountMaintenancePermissionInBU
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.remove}/${FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS.root}/${FINES_ACC_REMOVE_NON_PAYING_PG_ROUTING_PATHS.children.parentGuardian}`
      : '/access-denied';
  }
}
