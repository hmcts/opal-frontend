import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
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
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
@Component({
  selector: 'app-fines-acc-defendant-details-payment-terms-tab',
  imports: [
    FinesNotProvidedComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryCardListComponent,
    DateFormatPipe,
    MonetaryPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './fines-acc-defendant-details-payment-terms-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsPaymentTermsTabComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  @Input({ required: true }) tabData!: IOpalFinesAccountDefendantDetailsPaymentTermsLatest;
  @Input() hasAmendPaymentTermsPermission: boolean = false;
  @Input() canAmendPaymentTerms: boolean = false;
  @Input() amendPaymentTermsDeniedType: string = 'permission';
  @Input() canRequestPaymentCard: boolean = false;
  @Input() requestPaymentCardDeniedType: string = 'permission';
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
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
    if (typeCode === 'B') return 'Pay in full';
    if (typeCode === 'P') return 'Paid';
    return 'Paid'; // default
  }

  /**
   * Determines the target URL for the change payment terms action.
   */
  public changePaymentTermsLink(): string {
    return this.canAmendPaymentTerms
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/amend`
      : `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/denied/${this.amendPaymentTermsDeniedType}`;
  }

  /**
   * Determines the target URL for the request payment card action.
   */
  public requestPaymentCardLink(): string {
    return this.canRequestPaymentCard
      ? `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`
      : `../${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/denied/${this.requestPaymentCardDeniedType}`;
  }

  /**
   * Navigates to the request payment card path resolved by the current tab state.
   */
  public handleRequestPaymentCard(): void {
    this.router.navigate([this.requestPaymentCardLink()], {
      relativeTo: this.activatedRoute,
    });
  }
}
