import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciPaymentMappings } from '../../routing/interfaces/fines-mci-payment-mappings.interface';
import { FinesMciCreateTillCourtFeePaymentDetailsFormComponent } from './fines-mci-create-till-court-fee-payment-details-form/fines-mci-create-till-court-fee-payment-details-form.component';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details',
  imports: [FinesMciCreateTillCourtFeePaymentDetailsFormComponent],
  templateUrl: './fines-mci-create-till-court-fee-payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsComponent {
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly paymentMappings = inject(ActivatedRoute).snapshot.data['paymentMappings'] as
    | IFinesMciPaymentMappings
    | null
    | undefined;
}
