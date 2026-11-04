import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
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
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MCI_ROUTING_PATHS } from '../../routing/constants/fines-mci-routing-paths.constant';
import { FinesMciStore } from '../../stores/fines-mci.store';

const AMOUNT_PATTERN = /^\d+(?:\.\d+)?$/;

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
export class FinesMciCreateTillCourtFeeDetailsComponent implements OnInit {
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
  private courtFeeSearchText = '';

  protected readonly businessUnitName = this.finesMciStore.businessUnit()?.business_unit_name;
  protected readonly courtFeeItems = signal<IAlphagovAccessibleAutocompleteItem[]>([]);
  protected readonly feeLoadFailed = signal(false);
  protected readonly feesLoaded = signal(false);
  protected courtFeeSelectionError: string | null = null;
  protected amountError: string | null = null;
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

  /** Validates the selected court fee and amount before later payment validations are added. */
  public handleSubmit(): void {
    const courtFeeId = this.form.controls.courtFeeId.value;
    const selectedFee = this.courtFeeItems().find(({ value }) => value === courtFeeId);
    const input = this.courtFeeAutocomplete?.nativeElement.querySelector<HTMLInputElement>('#courtFeeId-autocomplete');
    const enteredText = input?.value.trim() || this.courtFeeSearchText.trim();

    const validCourtFee = selectedFee && (!input || enteredText === selectedFee.name);
    this.courtFeeSelectionError = validCourtFee
      ? null
      : enteredText
        ? 'Enter a valid court fee'
        : 'Enter court fee code';

    const amount = this.form.controls.amountPaid.value?.trim() ?? '';
    this.amountError = !amount ? 'Enter an amount' : AMOUNT_PATTERN.test(amount) ? null : 'Enter numbers only';

    const errors: IAbstractFormBaseFormErrorSummaryMessage[] = [];
    if (this.courtFeeSelectionError) {
      errors.push({ fieldId: 'courtFeeId-autocomplete', message: this.courtFeeSelectionError });
    }
    if (this.amountError) {
      errors.push({ fieldId: 'amountPaid', message: this.amountError });
    }
    this.formErrorSummaryMessage = errors;
    if (errors.length === 0) return;

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
}
