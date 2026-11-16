import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { IFinesMciSuspensePayerDetails } from '../../stores/interfaces/fines-mci.interface';
import { FINES_MCI_CREATE_TILL_PAYER_DETAILS_FIELD_ERRORS } from './constants/fines-mci-create-till-payer-details-field-errors.constant';
import { FINES_MCI_CREATE_TILL_PAYER_DETAILS_TITLE_OPTIONS } from './constants/fines-mci-create-till-payer-details-title-options.constant';
import {
  PAYER_NAME_PATTERN,
  PAYER_TEXT_PATTERN,
} from './constants/fines-mci-create-till-payer-details-patterns.constant';
import {
  nonWhitespaceRequiredValidator,
  PAYER_POSTCODE_PATTERN_VALIDATOR,
} from './validators/fines-mci-create-till-payer-details.validators';

@Component({
  selector: 'app-fines-mci-create-till-payer-details-form',
  imports: [
    ReactiveFormsModule,
    GovukSelectComponent,
    GovukTextInputComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
  ],
  templateUrl: './fines-mci-create-till-payer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillPayerDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciSuspensePayerDetails>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors = { ...FINES_MCI_CREATE_TILL_PAYER_DETAILS_FIELD_ERRORS };
  protected readonly titleOptions = FINES_MCI_CREATE_TILL_PAYER_DETAILS_TITLE_OPTIONS;
  @Input() public initialValue: IFinesMciSuspensePayerDetails | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  private updatePayerValidators(): void {
    const payerType = this.form.controls['payerType'].value;
    this.form.controls['lastName'].setValidators(
      payerType === 'individual'
        ? [nonWhitespaceRequiredValidator, Validators.maxLength(30), Validators.pattern(PAYER_NAME_PATTERN)]
        : [],
    );
    this.form.controls['companyName'].setValidators(
      payerType === 'company'
        ? [nonWhitespaceRequiredValidator, Validators.maxLength(50), Validators.pattern(PAYER_TEXT_PATTERN)]
        : [],
    );
    this.form.controls['lastName'].updateValueAndValidity({ emitEvent: false });
    this.form.controls['companyName'].updateValueAndValidity({ emitEvent: false });
    const inactiveFields =
      payerType === 'individual'
        ? ['companyName']
        : payerType === 'company'
          ? ['lastName']
          : ['lastName', 'companyName'];
    for (const field of inactiveFields) {
      this.removeControlErrors(field);
    }
    this.formErrorSummaryMessage =
      this.formErrorSummaryMessage?.filter((error) => !inactiveFields.includes(error.fieldId)) ?? [];
    this.formErrors = this.formErrors?.filter((error) => !inactiveFields.includes(error.fieldId)) ?? [];
    this.changeDetector.markForCheck();
  }

  protected override hasUnsavedChanges(): boolean {
    return Object.values(this.form.getRawValue()).some((value) => value !== null && value !== '');
  }

  public override ngOnInit(): void {
    const initial = this.initialValue;
    this.form = new FormGroup({
      payerType: new FormControl(initial?.payerType ?? null, Validators.required),
      title: new FormControl(initial?.title ?? null),
      firstNames: new FormControl(initial?.firstNames ?? '', [
        Validators.maxLength(20),
        Validators.pattern(PAYER_NAME_PATTERN),
      ]),
      lastName: new FormControl(initial?.lastName ?? ''),
      companyName: new FormControl(initial?.companyName ?? ''),
      addressLine1: new FormControl(initial?.addressLine1 ?? '', [
        optionalMaxLengthValidator(30),
        Validators.pattern(PAYER_TEXT_PATTERN),
      ]),
      addressLine2: new FormControl(initial?.addressLine2 ?? '', [
        optionalMaxLengthValidator(30),
        Validators.pattern(PAYER_TEXT_PATTERN),
      ]),
      addressLine3: new FormControl(initial?.addressLine3 ?? '', [
        optionalMaxLengthValidator(30),
        Validators.pattern(PAYER_TEXT_PATTERN),
      ]),
      postcode: new FormControl(initial?.postcode ?? '', [
        optionalMaxLengthValidator(8),
        PAYER_POSTCODE_PATTERN_VALIDATOR,
      ]),
    });
    this.setInitialErrorMessages();
    this.updatePayerValidators();
    this.form.controls['payerType'].valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.updatePayerValidators());
    super.ngOnInit();
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    if (this.form.controls['payerType'].value !== 'individual') {
      this.form.patchValue({ title: null, firstNames: '', lastName: '' }, { emitEvent: false });
    }
    if (this.form.controls['payerType'].value !== 'company') {
      this.form.controls['companyName'].setValue('', { emitEvent: false });
    }
    super.handleFormSubmit(event);
  }
}
