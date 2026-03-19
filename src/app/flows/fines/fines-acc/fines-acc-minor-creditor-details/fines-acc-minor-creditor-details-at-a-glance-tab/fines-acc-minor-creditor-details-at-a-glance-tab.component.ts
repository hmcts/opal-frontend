import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../../constants/fines-acc-debtor-types.constant';
import { NationalInsurancePipe } from '@hmcts/opal-frontend-common/pipes/national-insurance';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';
@Component({
  selector: 'app-fines-acc-minor-creditor-details-at-a-glance-tab',
  imports: [UpperCasePipe, MojBadgeComponent, NationalInsurancePipe, FinesNotProvidedComponent, DateFormatPipe],
  templateUrl: './fines-acc-minor-creditor-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsAtAGlanceTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountMinorCreditorAtAGlance;
  @Input() hasAddRemovePaymentHoldPermission: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() addPaymentHold = new EventEmitter<void>();
  @Output() removePaymentHold = new EventEmitter<void>();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public readonly debtorTypes = FINES_ACC_DEBTOR_TYPES;

  /**
   * Emits an event to indicate that the user wants to add a payment hold.
   */
  public handleAddPaymentHold(): void {
    this.addPaymentHold.emit();
  }

  /**
   * Emits an event to indicate that the user wants to remove a payment hold.
   */
  public handleRemovePaymentHold(): void {
    this.removePaymentHold.emit();
  }
}
