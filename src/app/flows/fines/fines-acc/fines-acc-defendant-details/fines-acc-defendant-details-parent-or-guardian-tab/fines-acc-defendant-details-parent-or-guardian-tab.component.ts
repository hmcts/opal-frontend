import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../../fines-acc-debtor-add-amend/constants/fines-acc-debtor-add-amend-party-types.constant';
import { FinesAccPartyDetails } from '../fines-acc-party-details/fines-acc-party-details.component';

@Component({
  selector: 'app-fines-acc-defendant-details-parent-or-guardian-tab',
  imports: [FinesAccPartyDetails],
  templateUrl: './fines-acc-defendant-details-parent-or-guardian-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsParentOrGuardianTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty | null;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeParentOrGuardianDetails = new EventEmitter<string>();
  @Output() removeParentOrGuardianDetails = new EventEmitter<string>();

  public handleRemoveParentOrGuardianDetails(): void {
    this.removeParentOrGuardianDetails.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.PARENT_GUARDIAN);
  }

  public handleChangeParentOrGuardianDetails(): void {
    this.changeParentOrGuardianDetails.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.PARENT_GUARDIAN);
  }
}
