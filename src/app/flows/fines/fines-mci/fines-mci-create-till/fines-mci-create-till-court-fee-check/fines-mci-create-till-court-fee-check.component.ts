import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-check',
  imports: [GovukBackLinkComponent],
  templateUrl: './fines-mci-create-till-court-fee-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeCheckComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private allowBack = false;
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isNavigating = signal(false);

  /** Allows the intentional return to payment details while protecting other route changes. */
  public canDeactivate(): boolean {
    const target = this.router.currentNavigation()?.finalUrl?.toString().split(/[?#]/)[0];
    return this.allowBack && !!target?.endsWith(`/${FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails}`);
  }

  /** Requests a warning before closing or refreshing the tab containing the in-memory till. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }

  /** Returns to the saved payment details, retaining the draft if navigation fails. */
  public handleBack(): void {
    if (this.isNavigating()) return;
    this.allowBack = true;
    this.isNavigating.set(true);
    void this.router
      .navigate([`../${FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails}`], { relativeTo: this.activatedRoute })
      .catch(() => false)
      .then(() => {
        this.allowBack = false;
        this.isNavigating.set(false);
      });
  }
}
