import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { IFinesMciSuspensePayerDetails } from '../../stores/interfaces/fines-mci.interface';

const namePattern = /^[a-zA-Z\- '\u2019]*$/;
const textPattern = /^[a-zA-Z0-9\- '\u2019]*$/;
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);

const FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  payerType: { required: { message: 'Select payer type', priority: 1 } },
  firstNames: {
    maxlength: { message: 'First names must be 20 characters or fewer', priority: 1 },
    pattern: { message: 'First names must only include letters a to z, hyphens, spaces and apostrophes', priority: 2 },
  },
  lastName: {
    required: { message: 'Enter last name', priority: 1 },
    maxlength: { message: 'Last name must be 30 characters or fewer', priority: 2 },
    pattern: { message: 'Last name must only include letters a to z, hyphens, spaces and apostrophes', priority: 3 },
  },
  companyName: {
    required: { message: 'Enter company name', priority: 1 },
    maxlength: { message: 'Company name must be 50 characters or fewer', priority: 2 },
    pattern: {
      message: 'Company name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  ...Object.fromEntries(
    [1, 2, 3].map((number) => [
      `addressLine${number}`,
      {
        maxlength: { message: `Address line ${number} must be 30 characters or fewer`, priority: 1 },
        pattern: {
          message: `Address line ${number} must only include letters a to z, numbers, hyphens, spaces and apostrophes`,
          priority: 2,
        },
      },
    ]),
  ),
  postcode: {
    maxlength: { message: 'Post code must be 8 characters or fewer', priority: 1 },
    alphanumericTextPattern: {
      message: 'Post code must only include letters a to z, numbers and spaces',
      priority: 2,
    },
  },
};

@Component({
  selector: 'app-fines-mci-create-till-payer-details-form',
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet,
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
  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciSuspensePayerDetails>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  protected override fieldErrors = FIELD_ERRORS;
  protected readonly individualFields = [
    { name: 'firstNames', label: 'First names', width: '20', bold: true },
    { name: 'lastName', label: 'Last name', width: '20', bold: true },
  ];
  protected readonly companyFields = [{ name: 'companyName', label: 'Company name', width: '20', bold: true }];
  protected readonly addressFields = [
    { name: 'addressLine1', label: 'Address line 1', width: 'full' },
    { name: 'addressLine2', label: 'Address line 2', width: 'full' },
    { name: 'addressLine3', label: 'Address line 3', width: '20' },
    { name: 'postcode', label: 'Post code', width: '10' },
  ];
  @Input() public initialValue: IFinesMciSuspensePayerDetails | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  private updatePayerValidators(): void {
    const payerType = this.form.controls['payerType'].value;
    this.form.controls['lastName'].setValidators(
      payerType === 'individual'
        ? [Validators.required, Validators.maxLength(30), Validators.pattern(namePattern)]
        : [],
    );
    this.form.controls['companyName'].setValidators(
      payerType === 'company' ? [Validators.required, Validators.maxLength(50), Validators.pattern(textPattern)] : [],
    );
    this.form.controls['lastName'].updateValueAndValidity({ emitEvent: false });
    this.form.controls['companyName'].updateValueAndValidity({ emitEvent: false });
  }

  protected fieldControl(name: string): FormControl {
    return this.form.controls[name] as FormControl;
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
        Validators.pattern(namePattern),
      ]),
      lastName: new FormControl(initial?.lastName ?? ''),
      companyName: new FormControl(initial?.companyName ?? ''),
      addressLine1: new FormControl(initial?.addressLine1 ?? '', [
        optionalMaxLengthValidator(30),
        Validators.pattern(textPattern),
      ]),
      addressLine2: new FormControl(initial?.addressLine2 ?? '', [
        optionalMaxLengthValidator(30),
        Validators.pattern(textPattern),
      ]),
      addressLine3: new FormControl(initial?.addressLine3 ?? '', [
        optionalMaxLengthValidator(30),
        Validators.pattern(textPattern),
      ]),
      postcode: new FormControl(initial?.postcode ?? '', [
        optionalMaxLengthValidator(8),
        ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
      ]),
    });
    this.updatePayerValidators();
    this.setInitialErrorMessages();
    this.form.controls['payerType'].valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.updatePayerValidators());
    super.ngOnInit();
  }

  public submitForm(event: SubmitEvent): void {
    this.formSubmitted = true;
    if (this.form.controls['payerType'].value !== 'individual') {
      this.form.patchValue({ title: null, firstNames: '', lastName: '' }, { emitEvent: false });
    }
    if (this.form.controls['payerType'].value !== 'company') {
      this.form.controls['companyName'].setValue('', { emitEvent: false });
    }
    this.handleFormSubmit(event);
  }
}
