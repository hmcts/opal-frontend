import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseForm,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukSelectComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-select';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { FINES_MAC_TITLE_DROPDOWN_OPTIONS } from '@app/flows/fines/fines-mac/constants/fines-mac-title-dropdown-options.constant';
import { IOpalFinesMapping } from '@services/fines/opal-fines-service/interfaces/opal-fines-mapping.interface';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS } from '../constants/fines-mci-create-till-court-fee-payment-details-field-errors.constant';
import { FINES_MCI_PAYMENT_DETAILS_PATTERNS } from '../constants/fines-mci-payment-details-patterns.constant';
import { requiredTrimmed } from '../validators/fines-mci-payment-details.validators';
import { IFinesMciCourtFeePaymentDetails } from '../../../stores/interfaces/fines-mci-court-fee-payment-details.interface';

@Component({
  selector: 'app-fines-mci-create-till-court-fee-payment-details-form',
  imports: [
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosConditionalComponent,
    GovukRadiosItemComponent,
    GovukTextInputComponent,
    GovukSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './fines-mci-create-till-court-fee-payment-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateTillCourtFeePaymentDetailsFormComponent extends AbstractFormBaseComponent implements OnInit {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    ...FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS,
  };
  protected readonly titleOptions = FINES_MAC_TITLE_DROPDOWN_OPTIONS;
  @Output() protected override formSubmit = new EventEmitter<IAbstractFormBaseForm<IFinesMciCourtFeePaymentDetails>>();
  @Output() protected cancelRequested = new EventEmitter<void>();
  @Input({ required: true }) public paymentMethods: IOpalFinesMapping[] = [];
  @Input({ required: true }) public paymentSources: IOpalFinesMapping[] = [];
  @Input() public initialValue: IFinesMciCourtFeePaymentDetails | null = null;
  public override formControlErrorMessages: IAbstractFormControlErrorMessage = {};

  /** Creates the payment controls with draft values and disables hidden conditional fields. */
  private initialiseForm(): void {
    const initial = this.initialValue;
    const individual = initial?.payerType === 'individual';
    const company = initial?.payerType === 'company';
    const hasReference = ['PO', 'CQ', 'CT'].includes(initial?.paymentMethod ?? '');
    this.form = new FormGroup({
      paymentReceivedFrom: new FormControl<string | null>(initial?.paymentReceivedFrom ?? null, Validators.required),
      paymentMethod: new FormControl<string | null>(initial?.paymentMethod ?? null, Validators.required),
      paymentSource: new FormControl<string | null>(
        { value: initial?.paymentSource ?? null, disabled: initial?.paymentMethod !== 'CT' },
        Validators.required,
      ),
      paymentReference: new FormControl<string | null>(
        { value: initial?.paymentReference ?? null, disabled: !hasReference },
        [Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphanumeric), Validators.maxLength(50)],
      ),
      payerType: new FormControl<string | null>(initial?.payerType ?? null, Validators.required),
      title: new FormControl<string | null>({ value: initial?.title ?? null, disabled: !individual }),
      firstNames: new FormControl<string | null>({ value: initial?.firstNames ?? null, disabled: !individual }, [
        Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphabetic),
        Validators.maxLength(20),
      ]),
      lastName: new FormControl<string | null>({ value: initial?.lastName ?? null, disabled: !individual }, [
        requiredTrimmed,
        Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphabetic),
        Validators.maxLength(30),
      ]),
      companyName: new FormControl<string | null>({ value: initial?.companyName ?? null, disabled: !company }, [
        requiredTrimmed,
        Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphanumeric),
        Validators.maxLength(50),
      ]),
      addressLine1: new FormControl<string | null>(initial?.addressLine1 ?? null, [
        Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphanumeric),
        Validators.maxLength(30),
      ]),
      addressLine2: new FormControl<string | null>(initial?.addressLine2 ?? null, [
        Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphanumeric),
        Validators.maxLength(30),
      ]),
      addressLine3: new FormControl<string | null>(initial?.addressLine3 ?? null, [
        Validators.pattern(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphanumeric),
        Validators.maxLength(30),
      ]),
      postcode: new FormControl<string | null>(initial?.postcode ?? null, [
        patternValidator(FINES_MCI_PAYMENT_DETAILS_PATTERNS.alphanumeric, 'pattern'),
        optionalMaxLengthValidator(8),
      ]),
    });
  }

  /** Clears payment references and sources and enables the fields for the selected method. */
  private setupPaymentMethodListener(): void {
    this.form.controls['paymentMethod'].valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((method: string | null) => {
        const source = this.form.controls['paymentSource'];
        const reference = this.form.controls['paymentReference'];
        source.reset(null, { emitEvent: false });
        reference.reset(null, { emitEvent: false });
        if (method === 'CT') source.enable({ emitEvent: false });
        else source.disable({ emitEvent: false });
        if (method === 'PO' || method === 'CQ' || method === 'CT') reference.enable({ emitEvent: false });
        else reference.disable({ emitEvent: false });
      });
  }

  /** Enables identity fields for the selected payer type while retaining their entered values. */
  private setupPayerTypeListener(): void {
    this.form.controls['payerType'].valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((payer: string | null) => {
        for (const field of ['title', 'firstNames', 'lastName']) {
          if (payer === 'individual') this.form.controls[field].enable({ emitEvent: false });
          else this.form.controls[field].disable({ emitEvent: false });
        }
        if (payer === 'company') this.form.controls['companyName'].enable({ emitEvent: false });
        else this.form.controls['companyName'].disable({ emitEvent: false });
      });
  }

  /** Refreshes displayed validation errors when the user edits the form. */
  private setupFormChangesListener(): void {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      this.formSubmitted = false;
      if (this.formErrorSummaryMessage.length) this.handleErrorMessages();
    });
  }

  /** Protects edited or restored form data until navigation is explicitly accepted. */
  protected override hasUnsavedChanges(): boolean {
    return this.form.dirty || this.initialValue !== null;
  }

  /** Initialises the payment form, validation messages and field change listeners. */
  public override ngOnInit(): void {
    this.initialiseForm();
    this.setInitialErrorMessages();
    this.setupPaymentMethodListener();
    this.setupPayerTypeListener();
    this.setupFormChangesListener();
    super.ngOnInit();
  }
}
