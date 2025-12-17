import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';

@Component({
  selector: 'app-fines-acc-defendant-details-payment-terms-tab',
  imports: [
    FinesNotProvidedComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardListComponent,
  ],
  templateUrl: './fines-acc-defendant-details-payment-terms-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsPaymentTermsTabComponent {
  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsPaymentTermsLatest;
  @Input() hasAmendPaymentTermsPermission: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() changePaymentTerms = new EventEmitter<void>();
  @Output() requestPaymentCard = new EventEmitter<void>();
  public readonly dateService = new DateService();
  public readonly utilsService = new UtilsService();
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;

  /**
   * Determines the card title based on the payment terms type and lump sum amount.
   * @returns string representing the card title
   */
  public cardTitle(): string {
    const { payment_terms } = this.tabData;

    if (payment_terms.lump_sum_amount && payment_terms.instalment_amount) return 'Lump sum plus instalments';
    if (payment_terms.lump_sum_amount) return 'Pay in full';
    if (payment_terms.instalment_amount) return 'Instalments only';

    const typeCode = payment_terms.payment_terms_type?.payment_terms_type_code;
    if (typeCode === 'B') return 'Pay by date';
    if (typeCode === 'P') return 'Paid';
    return 'Paid'; // default
  }

  /**
   * Emits an event to indicate a request to change payment terms.
   */
  public handleChangePaymentTerms(): void {
    this.changePaymentTerms.emit();
  }

  /**
   * Emits an event to indicate a request for a payment card.
   */
  public handleRequestPaymentCard(): void {
    this.requestPaymentCard.emit();
  }
}
