import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayment } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillSuspenseDetailsFormComponent } from './fines-mci-create-till-suspense-details-form/fines-mci-create-till-suspense-details-form.component';

@Component({
  selector: 'app-fines-mci-create-till-suspense-details',
  imports: [FinesMciCreateTillSuspenseDetailsFormComponent],
  templateUrl: './fines-mci-create-till-suspense-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillSuspenseDetailsComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly navigationRouter = inject(Router);
  protected readonly finesMciStore = inject(FinesMciStore);

  /** Restores leave protection when suspense details were saved before returning to this screen. */
  public ngOnInit(): void {
    this.stateUnsavedChanges = this.finesMciStore.suspensePayment() !== null;
  }

  /** Stores validated suspense details and routes to the next screen for the selected reason. */
  public handleSubmit(form: IAbstractFormBaseForm<IFinesMciSuspensePayment>): void {
    this.finesMciStore.setSuspensePayment(form.formData);
    this.stateUnsavedChanges = false;
    const target =
      form.formData.reason === 'unidentified'
        ? FINES_MCI_ROUTING_PATHS.children.checkSuspensePayment
        : FINES_MCI_ROUTING_PATHS.children.payerDetails;
    this.routerNavigate(target);
  }

  /** Returns to Till Details and clears the payment draft after navigation is accepted. */
  public handleCancel(): void {
    void this.navigationRouter
      .navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.details,
      ])
      .then((navigated) => {
        if (navigated) {
          this.finesMciStore.setDraftJourney(null);
          this.finesMciStore.setSuspensePayment(null);
        }
      });
  }

  /** Keeps leave protection enabled for child form input or previously stored details. */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges || this.finesMciStore.suspensePayment() !== null;
  }

  @HostListener('window:beforeunload')
  /** Prevents closing the browser tab while suspense details have been entered. */
  public handleBeforeUnload(): boolean {
    return !this.stateUnsavedChanges;
  }
}
