import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IOpalFinesCourtFeesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { IFinesMciPaymentMappings } from '../../routing/interfaces/fines-mci-payment-mappings.interface';
import { FinesMciCreateTillPaymentSummaryComponent } from '../fines-mci-create-till-payment-summary/fines-mci-create-till-payment-summary.component';
import { IFinesMciCreateTillPaymentSummaryRow } from '../fines-mci-create-till-payment-summary/interfaces/fines-mci-create-till-payment-summary-row.interface';
import { compareCourtFeeAmounts, comparePayment, formatPounds } from '../utils/fines-mci-court-fee-payment.utils';
import { FinesMciCreateTillCourtFeeCheckFormComponent } from './fines-mci-create-till-court-fee-check-form/fines-mci-create-till-court-fee-check-form.component';
import { IFinesMciCourtFeePayment } from '../../stores/interfaces/fines-mci-court-fee-payment.interface';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-check',
  imports: [
    GovukBackLinkComponent,
    FinesMciCreateTillPaymentSummaryComponent,
    FinesMciCreateTillCourtFeeCheckFormComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
  ],
  templateUrl: './fines-mci-create-till-court-fee-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeCheckComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private intendedDestination: string | null = null;
  protected readonly finesMciStore = inject(FinesMciStore);
  protected readonly isNavigating = signal(false);
  protected readonly summaryRows = signal<IFinesMciCreateTillPaymentSummaryRow[] | null>(null);
  protected readonly overpaymentMessage = signal<string | null>(null);
  protected readonly saveFailed = signal(false);

  /** Builds a complete payment snapshot from the validated drafts and displayed summary. */
  private buildPayment(): IFinesMciCourtFeePayment | null {
    const draft = this.finesMciStore.courtFeeDraft();
    const details = this.finesMciStore.courtFeePaymentDetails();
    const note = this.finesMciStore.courtFeeSuspenseNote();
    const rows = this.summaryRows();
    const courtFeeLabel = rows?.find((row) => row.id === 'court-fee')?.value;
    const amountLabel = rows?.find((row) => row.id === 'amount')?.value;
    if (
      draft?.courtFeeId == null ||
      !draft.amountPaid ||
      !draft.numberOfItems ||
      !details?.paymentReceivedFrom ||
      !details.paymentMethod ||
      !details.payerType ||
      !note.trim() ||
      !courtFeeLabel ||
      !amountLabel
    )
      return null;
    return {
      courtFeeId: draft.courtFeeId,
      amountPaid: draft.amountPaid,
      numberOfItems: draft.numberOfItems,
      courtFeeLabel,
      amountLabel,
      paymentDetails: {
        ...details,
        paymentReceivedFrom: details.paymentReceivedFrom,
        paymentMethod: details.paymentMethod,
        payerType: details.payerType,
      },
      suspenseNote: note,
    };
  }

  /** Opens an editing screen without discarding the saved payment. */
  private navigateToEdit(destination: string): void {
    if (this.isNavigating()) return;
    this.intendedDestination = destination;
    this.isNavigating.set(true);
    const state =
      destination === FINES_MCI_ROUTING_PATHS.children.courtFeeDetails ? { editCourtFeeFromCheck: true } : undefined;
    void this.router
      .navigate([`../${destination}`], { relativeTo: this.activatedRoute, ...(state && { state }) })
      .catch(() => false)
      .then(() => {
        this.intendedDestination = null;
        this.isNavigating.set(false);
      });
  }

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
    const comparison = comparePayment(draft, fee);
    if (comparison?.type === 'information') this.overpaymentMessage.set(comparison.message);

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

  /** Allows an intentional edit while protecting other route changes. */
  public canDeactivate(): boolean {
    const target = this.router.currentNavigation()?.finalUrl?.toString().split(/[?#]/)[0];
    return !!this.intendedDestination && !!target?.endsWith(`/${this.intendedDestination}`);
  }

  /** Requests a warning before closing or refreshing the tab containing the in-memory till. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return false;
  }

  /** Returns to the saved payment details, retaining the draft if navigation fails. */
  public handleBack(): void {
    this.navigateToEdit(FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails);
  }

  /** Opens the appropriate form for the selected summary row. */
  public handleChange(rowId: string): void {
    const feeRows = ['court-fee', 'amount', 'number-of-items'];
    this.navigateToEdit(
      feeRows.includes(rowId)
        ? FINES_MCI_ROUTING_PATHS.children.courtFeeDetails
        : FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails,
    );
  }

  /** Saves the payment after the requested navigation succeeds, preserving drafts on failure. */
  public handleSave(destination: 'review' | 'add'): void {
    if (this.isNavigating()) return;
    const payment = this.buildPayment();
    const tillId = this.finesMciStore.tills()[0]?.tillId;
    if (!payment || !tillId) {
      this.saveFailed.set(true);
      return;
    }
    const path =
      destination === 'review'
        ? FINES_MCI_ROUTING_PATHS.children.details
        : FINES_MCI_ROUTING_PATHS.children.paymentCategory;
    this.saveFailed.set(false);
    this.intendedDestination = path;
    this.isNavigating.set(true);
    void this.router
      .navigate([`../${path}`], {
        relativeTo: this.activatedRoute,
        ...(destination === 'add' && { state: { startNewPayment: true } }),
      })
      .catch(() => false)
      .then((navigated) => {
        if (navigated) this.finesMciStore.saveCourtFeePayment(tillId, payment);
        else this.saveFailed.set(true);
        this.intendedDestination = null;
        this.isNavigating.set(false);
      });
  }
}
