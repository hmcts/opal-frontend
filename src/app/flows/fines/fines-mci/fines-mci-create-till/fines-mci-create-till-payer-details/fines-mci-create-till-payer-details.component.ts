import { ChangeDetectionStrategy, Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayerDetails } from '../../stores/interfaces/fines-mci.interface';
import { FinesMciCreateTillPayerDetailsFormComponent } from './fines-mci-create-till-payer-details-form/fines-mci-create-till-payer-details-form.component';

@Component({
  selector: 'app-fines-mci-create-till-payer-details',
  imports: [FinesMciCreateTillPayerDetailsFormComponent, GovukBackLinkComponent],
  templateUrl: './fines-mci-create-till-payer-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPayerDetailsComponent extends AbstractFormParentBaseComponent implements OnInit {
  private readonly navigationRouter = inject(Router);
  protected readonly finesMciStore = inject(FinesMciStore);
  private isNavigatingFromPageAction = false;
  private hasUnsavedPayerDetails = false;

  private navigateTo(path: string, cancel: boolean): void {
    const suspensePayment = this.finesMciStore.suspensePayment();
    const payerDetails = this.finesMciStore.suspensePayerDetails();
    const draftJourney = this.finesMciStore.draftJourney();
    this.isNavigatingFromPageAction = !this.hasUnsavedPayerDetails && payerDetails === null;
    this.finesMciStore.setSuspensePayerDetails(null);
    if (cancel) {
      this.finesMciStore.setSuspensePayment(null);
      this.finesMciStore.setDraftJourney(null);
    }
    void this.navigationRouter
      .navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        path,
      ])
      .then((navigated) => {
        if (!navigated) {
          this.isNavigatingFromPageAction = false;
          this.finesMciStore.setSuspensePayerDetails(payerDetails);
          if (cancel) {
            this.finesMciStore.setSuspensePayment(suspensePayment);
            this.finesMciStore.setDraftJourney(draftJourney);
          }
        }
      });
  }

  public ngOnInit(): void {
    this.stateUnsavedChanges =
      this.finesMciStore.suspensePayment() !== null || this.finesMciStore.suspensePayerDetails() !== null;
  }

  public handleSubmit(form: IAbstractFormBaseForm<IFinesMciSuspensePayerDetails>): void {
    this.finesMciStore.setSuspensePayerDetails(form.formData);
    this.stateUnsavedChanges = false;
    this.routerNavigate(FINES_MCI_ROUTING_PATHS.children.checkSuspensePayment);
  }

  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.hasUnsavedPayerDetails = unsavedChanges;
    this.stateUnsavedChanges =
      unsavedChanges ||
      this.finesMciStore.suspensePayment() !== null ||
      this.finesMciStore.suspensePayerDetails() !== null;
  }

  /** Allows Back and Cancel from an empty payer form without disabling unload protection. */
  public override canDeactivate(): CanDeactivateTypes {
    return this.isNavigatingFromPageAction || super.canDeactivate();
  }

  public handleBack(): void {
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.suspenseDetails, false);
  }

  public handleCancel(): void {
    this.navigateTo(FINES_MCI_ROUTING_PATHS.children.details, true);
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !this.stateUnsavedChanges;
  }
}
