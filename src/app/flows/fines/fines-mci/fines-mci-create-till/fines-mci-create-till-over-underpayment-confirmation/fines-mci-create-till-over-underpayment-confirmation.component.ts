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
import { IOpalFinesCourtFee } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciCourtFeeDraft } from '../../stores/interfaces/fines-mci.interface';

interface ICourtFeePaymentComparison {
  type: 'information' | 'warning';
  heading: 'Confirm overpayment' | 'You cannot add an underpayment';
  message: string;
  courtFee: string;
  amount: string;
  numberOfItems: string;
}

/** Formats money without rounding sub-penny values or converting large integers to numbers. */
function formatPounds(amount: bigint, decimalPlaces: number): string {
  const scale = 10n ** BigInt(decimalPlaces);
  const pounds = amount / scale;
  const pence = (amount % scale).toString().padStart(decimalPlaces, '0').replace(/0+$/, '').padEnd(2, '0');
  return `£${pounds.toLocaleString('en-GB')}.${pence}`;
}

/** Compares the entered amount with the fee total without floating point rounding. */
function comparePayment(draft: IFinesMciCourtFeeDraft, fee: IOpalFinesCourtFee): ICourtFeePaymentComparison | null {
  const amount = draft.amountPaid?.trim();
  const numberOfItems = draft.numberOfItems?.trim();
  if (!amount || !/^\d+(?:\.\d+)?$/.test(amount) || !numberOfItems || !/^\d+$/.test(numberOfItems)) {
    return null;
  }

  const items = BigInt(numberOfItems);
  if (items === 0n) return null;

  const [wholePounds, fraction = ''] = amount.split('.');
  const decimalPlaces = Math.max(2, fraction.length);
  const scale = 10n ** BigInt(decimalPlaces);
  const paid = BigInt(wholePounds) * scale + BigInt(fraction.padEnd(decimalPlaces, '0'));
  const expected = BigInt(Math.round(fee.amount * 100)) * items * (scale / 100n);
  const difference = paid - expected;
  if (difference === 0n) return null;

  const overpayment = difference > 0n;
  const differenceAmount = formatPounds(overpayment ? difference : -difference, decimalPlaces);
  return {
    type: overpayment ? 'information' : 'warning',
    heading: overpayment ? 'Confirm overpayment' : 'You cannot add an underpayment',
    message: `This amount contains a ${differenceAmount} ${overpayment ? 'overpayment' : 'underpayment'}.`,
    courtFee: `${fee.court_fee_code} – ${fee.description} (${formatPounds(BigInt(Math.round(fee.amount * 100)), 2)})`,
    amount: formatPounds(paid, decimalPlaces),
    numberOfItems,
  };
}

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
  styleUrl: '../fines-mci-create-till-back-link.scss',
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
