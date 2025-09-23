import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantDetailsDefendantTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-defendant-tab-ref-data.interface';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesAccNotProvidedComponent } from '../../fines-acc-not-provided/fines-acc-not-provided.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-fines-acc-defendant-details-parent-or-guardian-tab',
  imports: [
    UpperCasePipe,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesAccNotProvidedComponent,
  ],
  templateUrl: './fines-acc-defendant-details-parent-or-guardian-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsParentOrGuardianTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsDefendantTabRefData | null;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() isYouth: boolean | null = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeParentOrGuardianDetails = new EventEmitter<Event>();
  @Output() removeParentOrGuardianDetails = new EventEmitter<Event>();
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;

  public handleRemoveParentOrGuardianDetails(event: Event): void {
    event.preventDefault();
    this.removeParentOrGuardianDetails.emit(event);
  }

  public handleChangeParentOrGuardianDetails(event: Event): void {
    event.preventDefault();
    this.changeParentOrGuardianDetails.emit(event);
  }
}
