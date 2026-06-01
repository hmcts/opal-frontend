import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { UpperCasePipe } from '@angular/common';
import { IOpalFinesAccountMinorCreditorCreditor } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-creditor.interface';
@Component({
  selector: 'app-fines-acc-minor-creditor-details-creditor-tab',
  imports: [GovukSummaryCardListComponent, GovukSummaryListComponent, GovukSummaryListRowComponent, UpperCasePipe],
  templateUrl: './fines-acc-minor-creditor-details-creditor-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsCreditorTab {
  @Input({ required: true }) tabData!: IOpalFinesAccountMinorCreditorCreditor;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() hasAccountMaintenancePermission: boolean = false;
  @Input() hasViewCreditorBacsPermission: boolean = false;
  @Output() changeCreditorDetails = new EventEmitter<boolean>();

  /**
   * Emits an event to change the creditor details.
   */
  public handleChangeCreditorDetails(event: Event): void {
    event.preventDefault();
    this.changeCreditorDetails.emit();
  }
}
