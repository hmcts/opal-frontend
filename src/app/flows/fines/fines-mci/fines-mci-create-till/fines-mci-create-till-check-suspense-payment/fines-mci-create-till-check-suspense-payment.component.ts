import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GovukSummaryCardListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-card-list';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';
import { IFinesMciSuspensePayment } from '../../stores/interfaces/fines-mci.interface';

const PAYMENT_METHODS: Record<NonNullable<IFinesMciSuspensePayment['methodOfPayment']>, string> = {
  notesCoins: 'Notes and coins',
  postalOrder: 'Postal order',
  cheque: 'Cheque',
  creditTransfer: 'Credit transfer',
};
const REASONS: Record<NonNullable<IFinesMciSuspensePayment['reason']>, string> = {
  overpayment: 'Fines overpayment (OF)',
  advance: 'Fine paid in advance (FA)',
  miscellaneous: 'Miscellaneous payment (MS)',
  unidentified: 'Unidentified amount (UN)',
};

@Component({
  selector: 'app-fines-mci-create-till-check-suspense-payment',
  imports: [GovukSummaryCardListComponent, GovukTextAreaComponent],
  templateUrl: './fines-mci-create-till-check-suspense-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCheckSuspensePaymentComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  @ViewChild('errorSummary', { read: ElementRef }) private readonly errorSummary?: ElementRef<HTMLElement>;
  private allowNavigation = false;
  protected readonly store = inject(FinesMciStore);
  protected readonly noteControl = new FormControl('', { nonNullable: true });
  protected noteError = false;

  /** Includes payment and payer drafts even when the note has not been entered. */
  private get hasUnsavedData(): boolean {
    return !!this.store.suspensePayment() || !!this.store.suspensePayerDetails() || this.note.length > 0;
  }

  /** Opens a till page and discards the draft only after an accepted cancellation. */
  private navigate(path: string, discard = false): void {
    this.allowNavigation = !discard;
    void this.router
      .navigate([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        path,
      ])
      .then((navigated) => {
        if (navigated && discard) this.store.discardSuspensePayment();
        if (!navigated) this.allowNavigation = false;
      });
  }

  /** Reads the suspense payment being checked from the store. */
  protected get payment(): IFinesMciSuspensePayment | null {
    return this.store.suspensePayment();
  }

  /** Reads the current note, including unsaved edits in the text area. */
  protected get note(): string {
    return this.noteControl.value;
  }

  /** Formats the draft amount in pounds, or shows a dash for a missing or invalid amount. */
  protected get amount(): string {
    const value = Number(this.payment?.amount);
    return this.payment?.amount && Number.isFinite(value)
      ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
      : '—';
  }

  /** Returns the display name of the selected payment method. */
  protected get paymentMethod(): string {
    const method = this.payment?.methodOfPayment;
    return method ? PAYMENT_METHODS[method] : '—';
  }

  /** Returns the display name of the selected suspense reason. */
  protected get reason(): string {
    const reason = this.payment?.reason;
    return reason ? REASONS[reason] : '—';
  }

  /** Reads the reference for the selected payment method, or shows a dash. */
  protected get reference(): string {
    const payment = this.payment;
    const reference =
      payment?.methodOfPayment === 'postalOrder'
        ? payment.paymentReferencePostalOrder
        : payment?.methodOfPayment === 'cheque'
          ? payment.paymentReferenceCheque
          : payment?.methodOfPayment === 'creditTransfer'
            ? payment.paymentReferenceCreditTransfer
            : '';
    return reference || '—';
  }

  /** Returns the company or individual payer name, or a dash when it is missing. */
  protected get payerName(): string {
    const payer = this.store.suspensePayerDetails();
    return payer?.payerType === 'company'
      ? payer.companyName || '—'
      : [payer?.firstNames, payer?.lastName].filter(Boolean).join(' ') || '—';
  }

  /** Returns the populated address lines for the payer. */
  protected get payerAddress(): string[] {
    const payer = this.store.suspensePayerDetails();
    return [payer?.addressLine1, payer?.addressLine2, payer?.addressLine3, payer?.postcode].filter(
      (line): line is string => !!line,
    );
  }

  /** Saves note edits to the store and clears the error once the note is valid. */
  protected onNoteChange(value: string): void {
    this.store.setSuspenseNote(value);
    if (value.trim() && value.length <= 1000) this.noteError = false;
  }

  /** Opens the suspense payment details form for amendment. */
  protected changePayment(): void {
    this.navigate(FINES_MCI_ROUTING_PATHS.children.suspenseDetails);
  }

  /** Opens the suspense payer details form for amendment. */
  protected changePayer(): void {
    this.navigate(FINES_MCI_ROUTING_PATHS.children.payerDetails);
  }

  /** Validates the note, focuses any error, then saves the payment and opens the requested page. */
  protected save(path: string): void {
    if (!this.note.trim() || this.note.length > 1000) {
      this.noteError = true;
      this.changeDetector.detectChanges();
      this.errorSummary?.nativeElement.focus({ preventScroll: true });
      return;
    }
    this.store.setSuspenseNote(this.note.trim());
    this.store.saveSuspensePayment();
    this.navigate(path);
  }

  /** Returns to till details and discards the draft after navigation succeeds. */
  protected cancel(): void {
    this.navigate(FINES_MCI_ROUTING_PATHS.children.details, true);
  }

  /** Restores the saved note and synchronises subsequent edits with the store. */
  public ngOnInit(): void {
    this.noteControl.setValue(this.store.suspenseNote(), { emitEvent: false });
    this.noteControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onNoteChange(value));
  }

  /** Blocks route navigation while any suspense data remains unless this page requested the transition. */
  public canDeactivate(): CanDeactivateTypes {
    return this.allowNavigation || !this.hasUnsavedData;
  }

  /** Blocks browser unload while any suspense payment data remains. */
  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !this.hasUnsavedData;
  }
}
