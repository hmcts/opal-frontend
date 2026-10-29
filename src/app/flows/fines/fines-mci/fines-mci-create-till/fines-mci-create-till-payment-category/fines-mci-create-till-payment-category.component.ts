import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesMciCreateTillPaymentCategoryFormComponent } from './fines-mci-create-till-payment-category-form/fines-mci-create-till-payment-category-form.component';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciCreateTillPaymentCategoryFormState } from './interfaces/fines-mci-create-till-payment-category-form-state.interface';

@Component({
  selector: 'app-fines-mci-create-till-payment-category',
  imports: [FinesMciCreateTillPaymentCategoryFormComponent],
  templateUrl: './fines-mci-create-till-payment-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPaymentCategoryComponent extends AbstractFormParentBaseComponent {
  protected readonly finesMciStore = inject(FinesMciStore);

  /** Handles Continue, adding the selected payment and opening its journey. */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesMciCreateTillPaymentCategoryFormState>): void {
    const paymentCategory = form.formData.paymentCategory;
    if (!paymentCategory) {
      this.stateUnsavedChanges = true;
      return;
    }

    const tillId = this.finesMciStore.ensureTill();
    this.finesMciStore.addPayment(tillId, paymentCategory);
    this.stateUnsavedChanges = false;

    const journeyRoute = {
      criminal: FINES_MCI_ROUTING_PATHS.children.searchAccount,
      courtFee: FINES_MCI_ROUTING_PATHS.children.courtFeeDetails,
      suspense: FINES_MCI_ROUTING_PATHS.children.suspenseDetails,
    }[paymentCategory];

    this.routerNavigate(journeyRoute);
  }

  /** Returns to Till Details when the user cancels. */
  public handleCancel(): void {
    this.routerNavigate(FINES_MCI_ROUTING_PATHS.children.details);
  }

  /** Updates the route guard state when the child form changes. */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  @HostListener('window:beforeunload')
  /** Allows the browser to unload only when there are no unsaved changes. */
  public handleBeforeUnload(): boolean {
    return !this.stateUnsavedChanges;
  }
}
