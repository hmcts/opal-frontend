import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MojBadgeComponent } from '@hmcts/opal-frontend-common/components/moj/moj-badge';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../../../fines-mac/fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesAccSummaryTabsContentStyles } from '../../fines-acc-defendant-details/interfaces/fines-acc-summary-tabs-content-styles.interface';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { FINES_ACC_DEBTOR_TYPES } from '../../constants/fines-acc-debtor-types.constant';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { IOpalFinesAccountMinorCreditorAtAGlance } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';
import { Router, RouterLink } from '@angular/router';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from '../../routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../routing/constants/fines-acc-defendant-routing-paths.constant';
@Component({
  selector: 'app-fines-acc-minor-creditor-details-at-a-glance-tab',
  imports: [UpperCasePipe, MojBadgeComponent, DateFormatPipe, RouterLink],
  templateUrl: './fines-acc-minor-creditor-details-at-a-glance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsAtAGlanceTabComponent {
  private readonly router = inject(Router);

  @Input({ required: true }) tabData!: IOpalFinesAccountMinorCreditorAtAGlance;
  @Input() hasAddRemovePaymentHoldPermission: boolean = false;
  @Input() hasAddRemovePaymentHoldPermissionInBU: boolean = false;
  @Input() style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Input() hasAssociatedDefendant: boolean = false;
  public readonly languages = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public readonly debtorTypes = FINES_ACC_DEBTOR_TYPES;

  /**
   * Determines the target URL for adding a payment hold.
   */
  public addPaymentHoldLink(): string {
    return this.hasAddRemovePaymentHoldPermissionInBU
      ? `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/add`
      : `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`;
  }

  /**
   * Determines the target URL for removing a payment hold.
   */
  public removePaymentHoldLink(): string {
    return this.hasAddRemovePaymentHoldPermissionInBU
      ? `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/remove`
      : `../${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/denied`;
  }

  /**
   * Determines the target URL for the associated defendant account details page.
   * @param accountId The ID of the defendant account.
   */
  public defendantAccountLink(accountId: number): string {
    return this.router.serializeUrl(
      this.router.createUrlTree([
        FINES_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.root,
        FINES_ACC_ROUTING_PATHS.children.defendant,
        accountId,
        FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
      ]),
    );
  }
}
