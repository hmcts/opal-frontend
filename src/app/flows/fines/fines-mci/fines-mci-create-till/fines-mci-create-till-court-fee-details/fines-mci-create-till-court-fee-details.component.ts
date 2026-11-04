import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { IOpalFinesCourtFee } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

const AMOUNT_PATTERN = /^\d+(?:\.\d+)?$/;
const NUMBER_OF_ITEMS_PATTERN = /^\d+$/;

function isPositiveNumberOfItems(value: string): boolean {
  return NUMBER_OF_ITEMS_PATTERN.test(value) && Number(value) > 0;
}

/** Compares money as whole pence so decimal fee amounts do not introduce floating point errors. */
function isExactCourtFeePayment(amount: string, feeAmount: number, numberOfItems: string): boolean {
  const [pounds, decimals = ''] = amount.split('.');
  const paddedDecimals = decimals.padEnd(2, '0');
  if (/[1-9]/.test(paddedDecimals.slice(2))) return false;

  const paidPence = BigInt(pounds) * 100n + BigInt(paddedDecimals.slice(0, 2));
  const expectedPence = BigInt(Math.round(feeAmount * 100)) * BigInt(numberOfItems);
  return paidPence === expectedPence;
}

@Component({
  selector: 'app-fines-mci-create-till-court-fee-details',
  imports: [
    AlphagovAccessibleAutocompleteComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    GovukTextInputPrefixSuffixComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-court-fee-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('courtFeeAutocomplete', { read: ElementRef })
  private readonly courtFeeAutocomplete?: ElementRef<HTMLElement>;
  @ViewChild('errorSummary', { read: ElementRef }) private readonly errorSummary?: ElementRef<HTMLElement>;

  private readonly finesMciStore = inject(FinesMciStore);
  private readonly opalFines = inject(OpalFines);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly courtFees = signal<IOpalFinesCourtFee[]>([]);
  private courtFeeSearchText = '';
  private isContinuing = false;

  protected readonly businessUnitName = this.finesMciStore.businessUnit()?.business_unit_name;
  protected readonly courtFeeItems = signal<IAlphagovAccessibleAutocompleteItem[]>([]);
  protected readonly feeLoadFailed = signal(false);
  protected readonly feesLoaded = signal(false);
  protected courtFeeSelectionError: string | null = null;
  protected amountError: string | null = null;
  protected numberOfItemsError: string | null = null;
  protected formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] = [];
  protected readonly form = new FormGroup({
    courtFeeId: new FormControl<number | null>(null),
    amountPaid: new FormControl<string | null>(null),
    numberOfItems: new FormControl<string | null>(null),
  });

  public constructor() {
    const draft = this.finesMciStore.courtFeeDraft();
    if (draft) this.form.setValue(draft);

    this.form.controls.courtFeeId.valueChanges.pipe(takeUntilDestroyed()).subscribe((courtFeeId) => {
      if (this.courtFeeItems().some(({ value }) => value === courtFeeId)) {
        this.courtFeeSelectionError = null;
        this.formErrorSummaryMessage = this.formErrorSummaryMessage.filter(
          ({ fieldId }) => fieldId !== 'courtFeeId-autocomplete',
        );
        this.changeDetector.markForCheck();
      }
    });

    this.form.controls.amountPaid.valueChanges.pipe(takeUntilDestroyed()).subscribe((amount) => {
      if (amount != null && AMOUNT_PATTERN.test(amount.trim())) {
        this.amountError = null;
        this.formErrorSummaryMessage = this.formErrorSummaryMessage.filter(({ fieldId }) => fieldId !== 'amountPaid');
        this.changeDetector.markForCheck();
      }
    });

    this.form.controls.numberOfItems.valueChanges.pipe(takeUntilDestroyed()).subscribe((numberOfItems) => {
      if (numberOfItems != null && isPositiveNumberOfItems(numberOfItems.trim())) {
        this.numberOfItemsError = null;
        this.formErrorSummaryMessage = this.formErrorSummaryMessage.filter(
          ({ fieldId }) => fieldId !== 'numberOfItems',
        );
        this.changeDetector.markForCheck();
      }
    });
  }

  /** Keeps typed text available when the autocomplete clears an invalid selection on blur. */
  protected handleCourtFeeInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.id === 'courtFeeId-autocomplete') {
      this.courtFeeSearchText = target.value;
    }
  }

  /** Focuses the field selected in the error summary. */
  protected scrollTo(fieldId: string): void {
    this.document.getElementById(fieldId)?.focus();
  }

  /** Validates the court fee payment details and opens the matching next screen. */
  public handleSubmit(): void {
    const courtFeeId = this.form.controls.courtFeeId.value;
    const selectedFeeItem = this.courtFeeItems().find(({ value }) => value === courtFeeId);
    const selectedFee = this.courtFees().find(({ court_fee_id }) => court_fee_id === courtFeeId);
    const input = this.courtFeeAutocomplete?.nativeElement.querySelector<HTMLInputElement>('#courtFeeId-autocomplete');
    const enteredText = input?.value.trim() || this.courtFeeSearchText.trim();

    const validCourtFee = selectedFeeItem && selectedFee && (!input || enteredText === selectedFeeItem.name);
    this.courtFeeSelectionError = validCourtFee
      ? null
      : enteredText
        ? 'Enter a valid court fee'
        : 'Enter court fee code';

    const amount = this.form.controls.amountPaid.value?.trim() ?? '';
    this.amountError = !amount ? 'Enter an amount' : AMOUNT_PATTERN.test(amount) ? null : 'Enter numbers only';

    const numberOfItems = this.form.controls.numberOfItems.value?.trim() ?? '';
    this.numberOfItemsError = !numberOfItems
      ? 'Enter number of items'
      : !NUMBER_OF_ITEMS_PATTERN.test(numberOfItems)
        ? 'Enter numbers only'
        : isPositiveNumberOfItems(numberOfItems)
          ? null
          : 'Enter a number of items greater than 0';

    const errors: IAbstractFormBaseFormErrorSummaryMessage[] = [];
    if (this.courtFeeSelectionError) {
      errors.push({ fieldId: 'courtFeeId-autocomplete', message: this.courtFeeSelectionError });
    }
    if (this.amountError) {
      errors.push({ fieldId: 'amountPaid', message: this.amountError });
    }
    if (this.numberOfItemsError) {
      errors.push({ fieldId: 'numberOfItems', message: this.numberOfItemsError });
    }
    this.formErrorSummaryMessage = errors;
    if (errors.length === 0 && selectedFee) {
      this.finesMciStore.setCourtFeeDraft(this.form.getRawValue());
      const destination = isExactCourtFeePayment(amount, selectedFee.amount, numberOfItems)
        ? FINES_MCI_ROUTING_PATHS.children.courtFeePaymentDetails
        : FINES_MCI_ROUTING_PATHS.children.overUnderpaymentConfirmation;
      this.isContinuing = true;
      void this.router.navigate([`../${destination}`], { relativeTo: this.activatedRoute }).then((navigated) => {
        if (!navigated) this.isContinuing = false;
      });
      return;
    }

    this.form.markAllAsTouched();
    this.changeDetector.detectChanges();
    this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus({ preventScroll: true });
  }

  public ngOnInit(): void {
    const businessUnitId = this.finesMciStore.businessUnit()?.business_unit_id;
    if (businessUnitId == null) {
      this.feeLoadFailed.set(true);
      return;
    }

    this.opalFines
      .getCourtFees(businessUnitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ court_fees }) => {
          this.courtFees.set(court_fees);
          this.courtFeeItems.set(
            court_fees.map(({ court_fee_id, court_fee_code, description, amount }) => ({
              value: court_fee_id,
              name: `${court_fee_code} - ${description} (£${amount.toFixed(2)})`,
            })),
          );
          this.feesLoaded.set(true);
        },
        error: () => this.feeLoadFailed.set(true),
      });
  }

  public handleCancel(): void {
    void this.router
      .navigate([`../${FINES_MCI_ROUTING_PATHS.children.details}`], { relativeTo: this.activatedRoute })
      .then((navigated) => {
        if (navigated) {
          this.finesMciStore.setCourtFeeDraft(null);
          this.finesMciStore.setDraftJourney(null);
        }
      });
  }

  /** Warns before leaving when the current Court Fee Details form contains entered data. */
  public canDeactivate(): CanDeactivateTypes {
    const { courtFeeId, amountPaid, numberOfItems } = this.form.getRawValue();
    const hasEnteredData =
      this.form.dirty ||
      courtFeeId !== null ||
      !!amountPaid?.trim() ||
      !!numberOfItems?.trim() ||
      !!this.courtFeeSearchText.trim();

    return this.isContinuing || !hasEnteredData;
  }

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return this.canDeactivate() === true;
  }

  /** Discards the Court Fee draft after a confirmed departure other than Continue. */
  public ngOnDestroy(): void {
    if (!this.isContinuing) {
      this.finesMciStore.setCourtFeeDraft(null);
      this.finesMciStore.setDraftJourney(null);
    }
  }
}
