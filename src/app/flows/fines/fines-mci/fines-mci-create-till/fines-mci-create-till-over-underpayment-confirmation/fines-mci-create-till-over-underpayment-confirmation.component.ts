import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { ICourtFeePaymentComparison } from '../interfaces/fines-mci-court-fee-payment-comparison.interface';
import { comparePayment } from '../utils/fines-mci-court-fee-payment.utils';

@Component({
  selector: 'app-fines-mci-create-till-over-underpayment-confirmation',
  imports: [
    GovukBackLinkComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
  ],
  templateUrl: './fines-mci-create-till-over-underpayment-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillOverUnderpaymentConfirmationComponent implements OnInit {
  private allowIntendedNavigation = false;
  private readonly opalFines = inject(OpalFines);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly payment = signal<ICourtFeePaymentComparison | null>(null);
  protected readonly loading = signal(true);

  private async navigateTo(path: string): Promise<boolean> {
    this.allowIntendedNavigation = true;
    try {
      return await this.router.navigate([`../${path}`], { relativeTo: this.activatedRoute });
    } finally {
      this.allowIntendedNavigation = false;
    }
  }

  public canDeactivate(): boolean {
    return this.allowIntendedNavigation;
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }

  public ngOnInit(): void {
    const draft = this.finesMciStore.courtFeeDraft();
    const businessUnitId = this.finesMciStore.businessUnit()?.business_unit_id;
    if (!draft || draft.courtFeeId == null || businessUnitId == null) {
      this.loading.set(false);
      return;
    }

    this.opalFines
      .getCourtFees(businessUnitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ court_fees }) => {
          const fee = court_fees.find(({ court_fee_id }) => court_fee_id === draft.courtFeeId);
          this.payment.set(fee ? comparePayment(draft, fee) : null);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  /** Returns to the court fee form with the existing draft. */
  public handleBack(): void {
    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.courtFeeDetails);
  }

  /** Continues to payment details only when the payment is an overpayment. */
  public handleConfirm(): void {
    if (this.payment()?.type !== 'information') return;

    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails);
  }

  /** Discards the payment draft after successfully returning to the till. */
  public handleReturnToTill(): void {
    if (this.payment()?.type !== 'warning') return;

    void this.navigateTo(FINES_MCI_ROUTING_PATHS.children.details).then((navigated) => {
      if (navigated) this.finesMciStore.setDraftJourney(null);
    });
  }
}
