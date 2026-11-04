import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { IFinesMciCourtFeeDraft } from '../../../stores/interfaces/fines-mci.interface';
import { FINES_MCI_CREATE_TILL_COURT_FEE_DETAILS_FIELD_ERRORS } from '../constants/fines-mci-create-till-court-fee-details-field-errors.constant';

const AMOUNT_PATTERN = /^\d+(?:\.\d+)?$/;
const NUMBER_OF_ITEMS_PATTERN = /^\d+$/;

function amountValidator(control: AbstractControl): ValidationErrors | null {
  const amount = (control.value as string | null)?.trim() ?? '';
  if (!amount) return { required: true };
  if (!AMOUNT_PATTERN.test(amount)) return { pattern: true };
  return null;
}

function numberOfItemsValidator(control: AbstractControl): ValidationErrors | null {
  const numberOfItems = (control.value as string | null)?.trim() ?? '';
  if (!numberOfItems) return { required: true };
  if (!NUMBER_OF_ITEMS_PATTERN.test(numberOfItems)) return { pattern: true };
  if (Number(numberOfItems) <= 0) return { min: true };
  return null;
}

@Component({
  selector: 'app-fines-mci-create-till-court-fee-details-form',
  imports: [
    AlphagovAccessibleAutocompleteComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    GovukTextInputPrefixSuffixComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-court-fee-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeeDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  @ViewChild('courtFeeAutocomplete', { read: ElementRef })
  private readonly courtFeeAutocomplete?: ElementRef<HTMLElement>;
  private courtFeeSearchText = '';

  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciCourtFeeDraft>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MCI_CREATE_TILL_COURT_FEE_DETAILS_FIELD_ERRORS,
  };
  @Input({ required: true }) public courtFeeItems: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input() public initialDraft: IFinesMciCourtFeeDraft | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  private readonly courtFeeSelectionValidator: ValidatorFn = (control) => {
    const selectedFeeItem = this.courtFeeItems.find(({ value }) => value === control.value);
    const input = this.courtFeeAutocomplete?.nativeElement.querySelector<HTMLInputElement>('#courtFeeId-autocomplete');
    const enteredText = input?.value.trim() || this.courtFeeSearchText.trim();

    if (!selectedFeeItem) return enteredText ? { invalidCourtFee: true } : null;
    if (input && enteredText !== selectedFeeItem.name) return { invalidCourtFee: true };
    return null;
  };

  /** Keeps unmatched autocomplete text available after the control clears its selection. */
  protected handleCourtFeeInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.id === 'courtFeeId-autocomplete') {
      this.courtFeeSearchText = target.value;
      this.form.controls['courtFeeId'].updateValueAndValidity({ emitEvent: false });
      if (this.formErrorSummaryMessage.length) this.handleErrorMessages();
    }
  }

  public override ngOnInit(): void {
    this.form = new FormGroup({
      courtFeeId: new FormControl<number | null>(this.initialDraft?.courtFeeId ?? null, [
        Validators.required,
        this.courtFeeSelectionValidator,
      ]),
      amountPaid: new FormControl<string | null>(this.initialDraft?.amountPaid ?? null, amountValidator),
      numberOfItems: new FormControl<string | null>(this.initialDraft?.numberOfItems ?? null, numberOfItemsValidator),
    });
    this.setInitialErrorMessages();
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      if (this.formErrorSummaryMessage.length) this.handleErrorMessages();
    });
    super.ngOnInit();
  }

  /** Refreshes autocomplete validity before the shared submit and error-summary behaviour runs. */
  public override handleFormSubmit(event: SubmitEvent): void {
    this.form.controls['courtFeeId'].updateValueAndValidity({ emitEvent: false });
    super.handleFormSubmit(event);
  }

  public hasEnteredData(): boolean {
    const { courtFeeId, amountPaid, numberOfItems } = this.form.getRawValue();
    return (
      this.form.dirty ||
      courtFeeId !== null ||
      !!amountPaid?.trim() ||
      !!numberOfItems?.trim() ||
      !!this.courtFeeSearchText.trim()
    );
  }
}
