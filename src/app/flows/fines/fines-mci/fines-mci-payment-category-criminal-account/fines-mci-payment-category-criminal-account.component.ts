import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OPAL_FINES_CONFIGURATION_ITEMS } from '@services/fines/opal-fines-service/constants/opal-fines-configuration-items.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import {
  FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT,
  FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_RESTRICTED_STATUS_HEADINGS,
} from './constants/fines-mci-payment-category-criminal-account-content.constant';

@Component({
  selector: 'app-fines-mci-payment-category-criminal-account',
  templateUrl: './fines-mci-payment-category-criminal-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalAccountComponent {
  private readonly store = inject(FinesMciStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly content = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT;
  /**
   * Uses at-a-glance restriction data, falling back to the header for optional status and balance fields.
   * Restricted statuses take precedence over zero balance and business-unit enforcement inhibits.
   */
  protected readonly heading = computed(() => {
    const account = this.store.selectedCriminalAccount();
    const atAGlance = this.store.selectedCriminalAccountAtAGlance();
    const header = this.store.selectedCriminalAccountHeader();
    const businessUnit = this.store.businessUnit();
    const statusCode = atAGlance?.account_status_code ?? header?.account_status_reference.account_status_code;
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (!account || String(account.defendant_account_id) !== accountId || !atAGlance || !businessUnit || !statusCode) {
      return this.content.unavailable;
    }

    const restrictedStatusHeading = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_RESTRICTED_STATUS_HEADINGS[statusCode];
    if (restrictedStatusHeading) {
      return restrictedStatusHeading;
    }

    const balance = atAGlance.account_balance ?? header?.payment_state_summary.account_balance;
    if (typeof balance !== 'number' || !Number.isFinite(balance)) {
      return this.content.unavailable;
    }
    if (balance === 0) {
      return this.content.zeroBalance;
    }

    const lastEnforcementActionId = atAGlance.enforcement_status.last_enforcement_action?.last_enforcement_action_id;
    const inhibitedEnforcementActionIds =
      businessUnit.configuration_items.find(
        (item) => item.item_name === OPAL_FINES_CONFIGURATION_ITEMS.resultsToInhibitPayments,
      )?.item_values ?? [];
    if (lastEnforcementActionId && inhibitedEnforcementActionIds.includes(lastEnforcementActionId)) {
      return this.content.inhibitedEnforcementAction;
    }

    return this.content.success;
  });
}
