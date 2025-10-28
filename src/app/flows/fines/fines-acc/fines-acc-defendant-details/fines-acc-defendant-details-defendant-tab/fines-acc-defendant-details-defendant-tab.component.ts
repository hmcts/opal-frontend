import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../../fines-acc-party-add-amend-convert/constants/fines-acc-party-add-amend-convert-party-types.constant';
import { FinesAccPartyDetails } from '../fines-acc-party-details/fines-acc-party-details.component';

@Component({
  selector: 'app-fines-acc-defendant-details-defendant-tab',
  imports: [FinesAccPartyDetails],
  templateUrl: './fines-acc-defendant-details-defendant-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsDefendantTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeDefendantDetails = new EventEmitter<string>();
  @Output() convertAccount = new EventEmitter<string>();

  public handleConvertAccount(): void {
    if (this.tabData.defendant_account_party.party_details.organisation_flag) {
      this.convertAccount.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY);
    } else {
      this.convertAccount.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL);
    }
  }

  public handleChangeDefendantDetails(): void {
    if (this.tabData.defendant_account_party.party_details.organisation_flag) {
      this.changeDefendantDetails.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.COMPANY);
    } else {
      this.changeDefendantDetails.emit(FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES.INDIVIDUAL);
    }
  }
}
