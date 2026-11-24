import { ChangeDetectionStrategy, Component, computed, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
  MojAlertTextComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../stores/fines-mci.store';
import { FINES_MCI_ROUTING_PATHS } from '../routing/constants/fines-mci-routing-paths.constant';
import { formatPounds } from '../fines-mci-create-till/utils/fines-mci-court-fee-payment.utils';

@Component({
  selector: 'app-fines-mci-payment-category-criminal-check-payment',
  imports: [
    GovukSummaryCardListComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojAlertTextComponent,
  ],
  templateUrl: './fines-mci-payment-category-criminal-check-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalCheckPaymentComponent {
  private readonly router = inject(Router);
  private allowNavigation = false;
  private readonly tillPath = [
    '/',
    FINES_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.root,
    FINES_MCI_ROUTING_PATHS.children.create,
    FINES_MCI_ROUTING_PATHS.children.till,
  ];
  private readonly criminalPath = [
    ...this.tillPath,
    FINES_MCI_ROUTING_PATHS.children.payment,
    FINES_MCI_ROUTING_PATHS.children.category,
    FINES_MCI_ROUTING_PATHS.children.criminal,
  ];
  private readonly paidPence = computed(() => {
    const amount = this.store.criminalPayment()?.amount ?? '';
    if (!/^-?(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(amount)) return null;
    const [pounds, pence = ''] = amount.replace('-', '').split('.');
    return (BigInt(pounds) * 100n + BigInt(pence.padEnd(2, '0'))) * (amount.startsWith('-') ? -1n : 1n);
  });

  protected readonly store = inject(FinesMciStore);

  protected readonly overpayment = computed(() => {
    const paid = this.paidPence();
    const balance =
      this.store.selectedCriminalAccountAtAGlance()?.account_balance ??
      this.store.selectedCriminalAccountHeader()?.payment_state_summary.account_balance;
    if (paid === null || typeof balance !== 'number' || !Number.isFinite(balance)) return null;
    const difference = paid - BigInt(Math.round(balance * 100));
    return difference > 0n ? formatPounds(difference, 2) : null;
  });

  protected readonly rows = computed(() => {
    const payment = this.store.criminalPayment();
    const paid = this.paidPence();
    if (!payment?.payerType || !payment.methodOfPayment || paid === null) return [];
    const account = this.store.selectedCriminalAccountAtAGlance();
    const selected = this.store.selectedCriminalAccount();
    const party = account?.party_details;
    const name = party?.organisation_flag
      ? party.organisation_details?.organisation_name
      : [party?.individual_details?.forenames, party?.individual_details?.surname?.toUpperCase()]
          .filter(Boolean)
          .join(' ');
    const fallbackName = selected?.organisation_flag
      ? selected.organisation_name
      : [selected?.defendant_firstnames, selected?.defendant_surname?.toUpperCase()].filter(Boolean).join(' ');
    const accountNumber = account?.account_number ?? selected?.account_number;
    const methods = {
      notesCoins: 'Notes and coins',
      postalOrder: 'Postal order',
      cheque: 'Cheque',
      creditTransfer: 'Credit transfer',
    };
    const reference =
      payment.methodOfPayment === 'postalOrder'
        ? payment.paymentReferencePostalOrder
        : payment.methodOfPayment === 'cheque'
          ? payment.paymentReferenceCheque
          : payment.methodOfPayment === 'creditTransfer'
            ? payment.paymentReferenceCreditTransfer
            : '';
    return [
      {
        label: 'Defendant',
        value: `${name || fallbackName || '—'}${accountNumber ? ` (${accountNumber})` : ''}`,
      },
      {
        label: 'Amount',
        value: `${paid < 0n ? '-' : ''}${formatPounds(paid < 0n ? -paid : paid, 2)}`,
      },
      {
        label: 'Payment received from',
        value: payment.payerType === 'defendant' ? 'Defendant' : 'Third party',
      },
      ...(payment.payerType === 'thirdParty' ? [{ label: 'Name', value: payment.thirdPartyName }] : []),
      { label: 'Method of payment', value: methods[payment.methodOfPayment] },
      ...(payment.methodOfPayment === 'creditTransfer' ? [{ label: 'Source', value: payment.source }] : []),
      { label: 'Payment reference', value: reference || '—' },
    ];
  });

  /** Opens the saved payment form, or confirms discarding the draft before changing defendant. */
  protected async change(label: string): Promise<void> {
    if (label === 'Defendant') {
      const navigated = await this.router
        .navigate([...this.criminalPath, FINES_MCI_ROUTING_PATHS.children.search])
        .catch(() => false);
      if (navigated) this.store.resetCriminalSearch();
      return;
    }
    this.allowNavigation = true;
    const navigated = await this.router
      .navigate([
        ...this.criminalPath,
        FINES_MCI_ROUTING_PATHS.children.paymentDetails,
        this.store.selectedCriminalAccount()?.defendant_account_id,
      ])
      .catch(() => false);
    if (!navigated) this.allowNavigation = false;
  }

  /** Returns to till details after confirming that the draft can be discarded. */
  protected async cancel(): Promise<void> {
    const navigated = await this.router
      .navigate([...this.tillPath, FINES_MCI_ROUTING_PATHS.children.details])
      .catch(() => false);
    if (navigated) {
      this.store.setDraftJourney(null);
      this.store.resetCriminalSearch();
    }
  }

  /** Lets the shared guard warn before leaving, while allowing payment amendments without a warning. */
  public canDeactivate(): CanDeactivateTypes {
    return this.allowNavigation || this.store.criminalPayment() === null;
  }

  /** Keeps browser unload protection while a payment draft is being checked. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return this.store.criminalPayment() === null;
  }
}
