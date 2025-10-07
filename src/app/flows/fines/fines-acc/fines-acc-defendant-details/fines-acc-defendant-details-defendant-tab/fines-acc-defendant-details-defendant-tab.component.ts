import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantAccountParty } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { UpperCasePipe } from '@angular/common';
import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../../fines-acc-debtor-add-amend/constants/fines-acc-debtor-add-amend-party-types.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-defendant-tab',
  imports: [
    UpperCasePipe,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesNotProvidedComponent,
  ],
  templateUrl: './fines-acc-defendant-details-defendant-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsDefendantTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() isYouth: boolean | null = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeDefendantDetails = new EventEmitter<string>();
  @Output() convertAccount = new EventEmitter<string>();
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;

  public handleConvertAccount(): void {
    if (this.tabData.defendant_account_party.party_details.organisation_flag) {
      this.convertAccount.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.COMPANY);
    } else {
      this.convertAccount.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.INDIVIDUAL);
    }
  }

  public handleChangeDefendantDetails(): void {
    if (this.tabData.defendant_account_party.party_details.organisation_flag) {
      this.changeDefendantDetails.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.COMPANY);
    } else {
      this.changeDefendantDetails.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.INDIVIDUAL);
    }
  }
}
