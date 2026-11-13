import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details',
  templateUrl: './fines-mci-create-till-court-fee-payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsComponent {
  protected readonly finesMciStore = inject(FinesMciStore);
}
