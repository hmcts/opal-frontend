import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IOpalFinesCourtFeesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { IFinesMciPaymentMappings } from '../../routing/interfaces/fines-mci-payment-mappings.interface';
import { FinesMciCreateTillPaymentSummaryComponent } from '../fines-mci-create-till-payment-summary/fines-mci-create-till-payment-summary.component';
import { IFinesMciCreateTillPaymentSummaryRow } from '../fines-mci-create-till-payment-summary/interfaces/fines-mci-create-till-payment-summary-row.interface';
import { compareCourtFeeAmounts, formatPounds } from '../utils/fines-mci-court-fee-payment.utils';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-check',
  imports: [GovukBackLinkComponent, FinesMciCreateTillPaymentSummaryComponent],
  templateUrl: './fines-mci-create-till-court-fee-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeCheckComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private allowBack = false;
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isNavigating = signal(false);
  protected readonly summaryRows = signal<IFinesMciCreateTillPaymentSummaryRow[] | null>(null);

  /** Builds the court fee summary from the saved drafts and resolved reference data. */
  public ngOnInit(): void {
    const draft = this.finesMciStore.courtFeeDraft();
    const details = this.finesMciStore.courtFeePaymentDetails();
    const fees = this.activatedRoute.snapshot.data['courtFees'] as IOpalFinesCourtFeesResponse | null | undefined;
    const mappings = this.activatedRoute.snapshot.data['paymentMappings'] as
      | IFinesMciPaymentMappings
      | null
      | undefined;
    const fee = fees?.court_fees.find((item) => item.court_fee_id === draft?.courtFeeId);
    if (!draft || !details || !fee || !mappings || !draft.amountPaid || !draft.numberOfItems) return;

    const amount = compareCourtFeeAmounts(draft.amountPaid, fee.amount, draft.numberOfItems);
    if (!amount) return;

    const empty = '—';
    const payerName =
      details.payerType === 'individual'
        ? [details.title, details.firstNames, details.lastName].filter((value) => value?.trim()).join(' ')
        : details.companyName;
    const address = [details.addressLine1, details.addressLine2, details.addressLine3, details.postcode]
      .filter((value) => value?.trim())
      .join(', ');
    const receivedFrom = details.paymentReceivedFrom === 'applicant' ? 'Applicant' : 'Third party';
    const payerType = details.payerType === 'individual' ? 'Individual' : 'Company';
    const rows: IFinesMciCreateTillPaymentSummaryRow[] = [
      {
        id: 'court-fee',
        label: 'Court fee',
        value: `${fee.court_fee_code} – ${fee.description} (${formatPounds(BigInt(Math.round(fee.amount * 100)), 2)})`,
      },
      { id: 'amount', label: 'Amount', value: formatPounds(amount.paid, amount.decimalPlaces) },
      { id: 'number-of-items', label: 'Number of items', value: draft.numberOfItems.trim() },
      {
        id: 'payment-received-from',
        label: 'Payment received from',
        value: details.paymentReceivedFrom ? receivedFrom : empty,
      },
      {
        id: 'payment-method',
        label: 'Method of payment',
        value: mappings.methods.find((item) => item.code === details.paymentMethod)?.display_name ?? empty,
      },
    ];
    if (details.paymentMethod === 'CT') {
      rows.push({
        id: 'source',
        label: 'Source',
        value: mappings.sources.find((item) => item.code === details.paymentSource)?.display_name ?? empty,
      });
    }
    rows.push(
      { id: 'payment-reference', label: 'Payment reference', value: details.paymentReference?.trim() || empty },
      { id: 'payer-type', label: 'Payer type', value: details.payerType ? payerType : empty },
      { id: 'payer-name', label: 'Payer name', value: payerName?.trim() || empty },
      { id: 'address', label: 'Address', value: address || empty },
    );
    this.summaryRows.set(rows);
  }

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
