import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { JsonPipe, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantDetailsDefendantTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-defendant-tab-ref-data.interface';
import {
  GovukSummaryCardActionComponent,
  GovukSummaryCardListComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesAccNotProvidedComponent } from '../../fines-acc-not-provided/fines-acc-not-provided.component';

@Component({
  selector: 'app-fines-acc-defendant-details-defendant-tab',
  imports: [
    UpperCasePipe,
    GovukTagComponent,
    MojBadgeComponent,
    GovukSummaryCardListComponent,
    GovukSummaryCardActionComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesAccNotProvidedComponent,
    JsonPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './fines-acc-defendant-details-defendant-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsDefendantTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsDefendantTabRefData | null;
  @Input() hasAccountMaintenencePermission: boolean = false;
  @Input() isYouth: boolean | null = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changeDefendantDetails = new EventEmitter<Event>();
  @Output() convertAccount = new EventEmitter<Event>();
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;

  public handleConvertAccount(event: Event): void {
    event.preventDefault();
    this.convertAccount.emit(event);
  }

  public handleChangeDefendantDetails(event: Event): void {
    event.preventDefault();
    this.changeDefendantDetails.emit(event);
  }
}
