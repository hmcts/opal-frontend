import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FinesAccPaymentTermsAmendFormComponent } from './fines-acc-payment-terms-amend-form/fines-acc-payment-terms-amend-form.component';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccPaymentTermsAmendForm } from './interfaces/fines-acc-payment-terms-amend-form.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM } from './constants/fines-acc-payment-terms-amend-form.constant';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { OpalFines } from '../../services/opal-fines-service/opal-fines.service';
import { IOpalFinesAmendPaymentTermsPayload } from '../../services/opal-fines-service/interfaces/opal-fines-amend-payment-terms-payload.interface';
import { FinesAccountStore } from '../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../routing/constants/fines-acc-defendant-routing-paths.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG } from '../services/constants/fines-acc-transform-items-config.constant';

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
  protected readonly prefilledFormData: IFinesAccPaymentTermsAmendForm = this.transformResolvedData();
  protected readonly finesDefendantRoutingPaths = FINES_ACC_DEFENDANT_ROUTING_PATHS;

  /**
   * Transforms the raw resolved data into the form structure
   */
  private transformResolvedData(): IFinesAccPaymentTermsAmendForm {
    const resolvedData = this['activatedRoute'].snapshot.data['paymentTermsFormData'];

    if (!resolvedData || !resolvedData.paymentTermsData || !resolvedData.resultData) {
      return FINES_ACC_PAYMENT_TERMS_AMEND_FORM;
    }

    return this.payloadService.transformPaymentTermsPayload(
      this.payloadService.transformPayload(resolvedData.paymentTermsData, FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG),
      resolvedData.resultData,
    );
  }

  /**
   * Validates that all required data is available for the payment terms amendment
   */
  private validateRequiredData(): boolean {
    const defendantAccountId = this.finesAccountStore.account_id();
    const businessUnitId = this.finesAccountStore.business_unit_id();
    const ifMatch = this.finesAccountStore.base_version();

    return !!(defendantAccountId && businessUnitId && ifMatch);
  }

  /**
   * Submits the payment terms amendment to the API
   */
  private submitPaymentTermsAmendment(payload: IOpalFinesAmendPaymentTermsPayload): void {
    const defendantAccountId = this.finesAccountStore.account_id()!;
    const businessUnitId = this.finesAccountStore.business_unit_id()!;
    const ifMatch = this.finesAccountStore.base_version()!;

    this.opalFinesService
      .postDefendantAccountPaymentTerms(defendantAccountId, payload, businessUnitId, ifMatch)
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
          this.navigateToDetails();
        },
      });
  }

  /**
   * Navigates to the defendant details page with payment terms fragment
   */
  private navigateToDetails(): void {
    const fragment = 'payment-terms';
    this.routerNavigate(this.finesDefendantRoutingPaths.children.details, false, undefined, undefined, fragment);
  }

  /**
   * Handles the form submission for payment terms amendment
   */
  public handlePaymentTermsSubmit(formData: IFinesAccPaymentTermsAmendForm): void {
    const payload = this.payloadService.buildPaymentTermsAmendPayload(formData.formData);

    if (!this.validateRequiredData()) {
      this.navigateToDetails();
      return;
    }

    this.submitPaymentTermsAmendment(payload);
  }

  /**
   * Handles unsaved changes when navigating away
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }
}
