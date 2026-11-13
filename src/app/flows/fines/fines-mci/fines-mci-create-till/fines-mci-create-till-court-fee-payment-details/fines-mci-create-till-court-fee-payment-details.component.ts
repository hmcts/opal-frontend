import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciPaymentMappings } from '../../routing/interfaces/fines-mci-payment-mappings.interface';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciCreateTillCourtFeePaymentDetailsFormComponent } from './fines-mci-create-till-court-fee-payment-details-form/fines-mci-create-till-court-fee-payment-details-form.component';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details',
  imports: [FinesMciCreateTillCourtFeePaymentDetailsFormComponent, GovukBackLinkComponent, GovukCancelLinkComponent],
  templateUrl: './fines-mci-create-till-court-fee-payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsComponent extends AbstractFormParentBaseComponent {
  private readonly navigationRouter = inject(Router);
  private readonly currentRoute = inject(ActivatedRoute);
  private readonly previousUrlPath = this.navigationRouter
    .currentNavigation()
    ?.previousNavigation?.finalUrl?.toString()
    .split(/[?#]/)[0];

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isNavigating = signal(false);
  protected readonly paymentMappings = this.currentRoute.snapshot.data['paymentMappings'] as
    | IFinesMciPaymentMappings
    | null
    | undefined;

  /**
   * Opens a sibling screen while preventing edits during navigation.
   *
   * @param destination The sibling route to open.
   * @returns Whether the navigation succeeded.
   */
  private async navigateTo(destination: string): Promise<boolean> {
    if (this.isNavigating()) return false;
    this.isNavigating.set(true);
    try {
      return await this.navigationRouter.navigate([`../${destination}`], { relativeTo: this.currentRoute });
    } catch {
      return false;
    } finally {
      this.isNavigating.set(false);
    }
  }

  /** Returns to the screen that led to payment details, keeping the court fee draft. */
  public handleBack(): void {
    const confirmation = FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation;
    const destination = this.previousUrlPath?.endsWith(`/${confirmation}`)
      ? confirmation
      : FINES_MCI_ROUTING_PATHS.children.courtFeeDetails;
    void this.navigateTo(destination);
  }

  /** Returns to the till and discards the court fee draft only after navigation succeeds. */
  public handleCancel(): void {
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.details).then((navigated) => {
      if (navigated) this.finesMciStore.setDraftJourney(null);
    });
  }

  /** Tracks entered payment details for the route leave warning. */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /** Requests a warning before refreshing or closing the tab containing the in-memory till. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }
}
