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
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../../fines-acc-debtor-add-amend/constants/fines-acc-debtor-add-amend-party-types.constant';

@Component({
  selector: 'app-fines-acc-defendant-details-parent-or-guardian-tab',
  imports: [
    UpperCasePipe,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesNotProvidedComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './fines-acc-defendant-details-parent-or-guardian-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsParentOrGuardianTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantAccountParty | null;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() isYouth: boolean | null = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeParentOrGuardianDetails = new EventEmitter<string>();
  @Output() removeParentOrGuardianDetails = new EventEmitter<string>();
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;

  public handleRemoveParentOrGuardianDetails(): void {
    this.removeParentOrGuardianDetails.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.PARENT_GUARDIAN);
  }

  public handleChangeParentOrGuardianDetails(): void {
    this.changeParentOrGuardianDetails.emit(FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES.PARENT_GUARDIAN);
  }
}
