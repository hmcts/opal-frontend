import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { FinesMciCreateTillCourtFeePaymentDetailsFormComponent } from './fines-mci-create-till-court-fee-payment-details-form/fines-mci-create-till-court-fee-payment-details-form.component';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details',
  imports: [FinesMciCreateTillCourtFeePaymentDetailsFormComponent],
  templateUrl: './fines-mci-create-till-court-fee-payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsComponent {
  protected readonly finesMciStore = inject(FinesMciStore);
}
