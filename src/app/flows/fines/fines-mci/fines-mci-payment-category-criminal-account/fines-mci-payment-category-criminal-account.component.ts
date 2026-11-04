import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT } from './constants/fines-mci-payment-category-criminal-account-content.constant';

@Component({
  selector: 'app-fines-mci-payment-category-criminal-account',
  templateUrl: './fines-mci-payment-category-criminal-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalAccountComponent {
  private readonly store = inject(FinesMciStore);
  private readonly route = inject(ActivatedRoute);

  protected readonly content = FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT;
  protected readonly heading = computed(() => {
    const account = this.store.selectedCriminalAccount();
    const header = this.store.selectedCriminalAccountHeader();
    const statusCode = header?.account_status_reference.account_status_code;
    const accountId = this.route.snapshot.paramMap.get('accountId');

    if (!account || String(account.defendant_account_id) !== accountId || !statusCode) {
      return this.content.unavailable;
    }

    if (statusCode === 'CS') {
      return this.content.consolidated;
    }
    if (statusCode === 'WO') {
      return this.content.writtenOff;
    }
    return this.content.success;
  });
}
