import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import { IFinesMciCriminalPayment } from '../stores/interfaces/fines-mci.interface';
import { FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent } from './fines-mci-payment-category-criminal-payment-details-form/fines-mci-payment-category-criminal-payment-details-form.component';

@Component({
  selector: 'app-fines-mci-payment-category-criminal-payment-details',
  imports: [FinesMciPaymentCategoryCriminalPaymentDetailsFormComponent, GovukBackLinkComponent],
  templateUrl: './fines-mci-payment-category-criminal-payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalPaymentDetailsComponent
  extends AbstractFormParentBaseComponent
  implements OnInit, OnDestroy
{
  private readonly navigationRouter = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private isContinuing = false;
  protected readonly finesMciStore = inject(FinesMciStore);

  protected get accountBalance(): number | null {
    return (
      this.finesMciStore.selectedCriminalAccountAtAGlance()?.account_balance ??
      this.finesMciStore.selectedCriminalAccountHeader()?.payment_state_summary.account_balance ??
      null
    );
  }

  /** Returns to account confirmation using the selected account type. */
  public async handleBack(): Promise<void> {
    const account = this.finesMciStore.selectedCriminalAccount();
    const navigated = await this.navigationRouter
      .navigate(
        [
          FINES_MCI_ROUTING_PATHS.children.account,
          this.route.snapshot.paramMap.get('accountId'),
          account?.organisation_flag ? 'company' : 'individual',
        ],
        { relativeTo: this.route.parent },
      )
      .catch(() => false);
    if (navigated) this.finesMciStore.setCriminalPayment(null);
  }

  /** Restores leave protection when criminal payment details were saved before returning to this screen. */
  public ngOnInit(): void {
    this.stateUnsavedChanges = this.finesMciStore.criminalPayment() !== null;
  }

  /** Saves validated payment details and opens Check Payment without a data-loss warning. */
  public async handleSubmit(form: IAbstractFormBaseForm<IFinesMciCriminalPayment>): Promise<void> {
    if (this.isContinuing) return;
    this.isContinuing = true;
    this.finesMciStore.setCriminalPayment(form.formData);
    this.stateUnsavedChanges = false;
    try {
      const navigated = await this.navigationRouter.navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.checkPayment,
      ]);
      if (!navigated) {
        this.isContinuing = false;
        this.stateUnsavedChanges = true;
      }
    } catch {
      this.isContinuing = false;
      this.stateUnsavedChanges = true;
    }
  }

  /** Returns to Till Details and clears the payment draft after navigation is accepted. */
  public async handleCancel(): Promise<void> {
    const navigated = await this.navigationRouter
      .navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.details,
      ])
      .catch(() => false);
    if (navigated) {
      this.finesMciStore.setDraftJourney(null);
      this.finesMciStore.resetCriminalSearch();
    }
  }

  /** Keeps leave protection enabled for child form input or previously stored details. */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges || this.finesMciStore.criminalPayment() !== null;
  }

  @HostListener('window:beforeunload')
  /** Prevents closing the browser tab while criminal payment details have been entered. */
  public handleBeforeUnload(): boolean {
    return !this.isContinuing && !this.stateUnsavedChanges;
  }

  /** Discards abandoned drafts, including browser-history exits, while preserving payments passed to Check Payment. */
  public ngOnDestroy(): void {
    if (!this.isContinuing) this.finesMciStore.setCriminalPayment(null);
  }
}
