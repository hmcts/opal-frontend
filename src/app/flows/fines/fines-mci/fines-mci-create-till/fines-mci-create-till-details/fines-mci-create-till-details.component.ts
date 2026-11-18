import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-details',
  imports: [GovukBackLinkComponent, GovukButtonComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-mci-create-till-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillDetailsComponent {
  private allowIntendedNavigation = false;
  private readonly router = inject(Router);
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isOpeningPayment = signal(false);
  protected readonly editPaymentFailed = signal(false);

  /** Opens an MCI till page and restores leave protection if navigation fails. */
  private async navigateTo(path: string, extras?: NavigationExtras): Promise<boolean> {
    this.allowIntendedNavigation = true;
    const navigated = await this.router
      .navigate(
        [
          '/',
          FINES_ROUTING_PATHS.root,
          FINES_MCI_ROUTING_PATHS.root,
          FINES_MCI_ROUTING_PATHS.children.create,
          FINES_MCI_ROUTING_PATHS.children.till,
          path,
        ],
        extras,
      )
      .catch(() => false);
    if (!navigated) this.allowIntendedNavigation = false;
    return navigated;
  }

  public canDeactivate(): CanDeactivateTypes {
    return this.allowIntendedNavigation;
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }

  public navigateBack(): void {
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit, {
      state: { preserveBusinessUnit: true },
    });
  }

  public addPayment(): void {
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.paymentCategory);
  }

  public cancel(event: Event): void {
    event.preventDefault();
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.cancel);
  }

  /** Opens a saved court fee for editing without changing the saved till entry. */
  public handleEditPayment(paymentId: string): void {
    if (this.isOpeningPayment()) return;
    const tillId = this.finesMciStore.tills()[0]?.tillId;
    const previous = {
      draftJourney: this.finesMciStore.draftJourney(),
      courtFeeDraft: this.finesMciStore.courtFeeDraft(),
      courtFeePaymentDetails: this.finesMciStore.courtFeePaymentDetails(),
      courtFeePaymentOrigin: this.finesMciStore.courtFeePaymentOrigin(),
      courtFeeSuspenseNote: this.finesMciStore.courtFeeSuspenseNote(),
      editingCourtFeePaymentId: this.finesMciStore.editingCourtFeePaymentId(),
    };
    if (!tillId || !this.finesMciStore.beginCourtFeePaymentEdit(tillId, paymentId)) {
      this.editPaymentFailed.set(true);
      return;
    }
    this.editPaymentFailed.set(false);
    this.isOpeningPayment.set(true);
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.checkCourtFee).then((navigated) => {
      if (
        !navigated ||
        !this.router.url.split(/[?#]/)[0].endsWith(`/${FINES_MCI_ROUTING_PATHS.children.checkCourtFee}`)
      ) {
        if (this.finesMciStore.editingCourtFeePaymentId() === paymentId)
          this.finesMciStore.restoreCourtFeeDraftState(previous);
        this.editPaymentFailed.set(true);
        this.allowIntendedNavigation = false;
      }
      this.isOpeningPayment.set(false);
    });
  }
}
