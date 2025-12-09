import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FinesAccPaymentTermsAmendFormComponent } from './fines-acc-payment-terms-amend-form/fines-acc-payment-terms-amend-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccPaymentTermsAmendForm } from './interfaces/fines-acc-payment-terms-amend-form.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from './constants/fines-acc-payment-terms-amend-form.constant';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  selector: 'app-fines-acc-payment-terms-amend',
  imports: [CommonModule, FinesAccPaymentTermsAmendFormComponent],
  templateUrl: './fines-acc-payment-terms-amend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccPaymentTermsAmendComponent extends AbstractFormParentBaseComponent {
  private readonly payloadService = inject(FinesAccPayloadService);
  private readonly opalFinesService = inject(OpalFines);
  private readonly finesAccountStore = inject(FinesAccountStore);
  private readonly utilsService = inject(UtilsService);
  protected readonly prefilledFormData: IFinesAccPaymentTermsAmendForm =
    this['activatedRoute'].snapshot.data['paymentTermsFormData'] || FINES_ACC_PAYMENT_TERMS_AMEND_FORM;
  protected readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;

  /**
   * Handles the form submission for payment terms amendment
   */
  public handlePaymentTermsSubmit(formData: IFinesAccPaymentTermsAmendForm): void {
    const payload = this.payloadService.buildPaymentTermsAmendPayload(formData.formData);
    const defendantAccountId = this.finesAccountStore.account_id()!;
    const businessUnitId = this.finesAccountStore.business_unit_id()!;
    const ifMatch = this.finesAccountStore.base_version()!;
    const fragment = 'payment-terms';

    if (!defendantAccountId || !businessUnitId || !ifMatch) {
      this.routerNavigate(this.finesDefendantRoutingPaths.children.details, false, undefined, undefined, fragment);
      return;
    }
    this.opalFinesService
      .putDefendantAccountPaymentTerms(defendantAccountId, payload, businessUnitId, ifMatch)
      .pipe(
        catchError(() => {
          this.utilsService.scrollToTop();
          this.stateUnsavedChanges = true;
          return EMPTY;
        }),
      )
      .subscribe({
        next: () => {
          this.opalFinesService.clearCache('defendantAccountPaymentTermsLatestCache$');
          this.routerNavigate(this.finesDefendantRoutingPaths.children.details, false, undefined, undefined, fragment);
        },
      });
  }

  /**
   * Handles unsaved changes when navigating away
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
