import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalEmailAddressValidator } from '@validators/optional-valid-email-address/optional-valid-email-address.validator';
import { optionalPhoneNumberValidator } from '@validators/optional-valid-telephone/optional-valid-telephone.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-employer-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-employer-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukTextInputComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
  ],
  templateUrl: './fines-mac-employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacEmployerDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacEmployerDetailsForm>();

  private readonly finesMacStore = inject(FinesMacStore);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.form = new FormGroup({
      fm_employer_details_employer_company_name: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
      fm_employer_details_employer_reference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      fm_employer_details_employer_email_address: new FormControl(null, [
        optionalMaxLengthValidator(76),
        optionalEmailAddressValidator(),
      ]),
      fm_employer_details_employer_telephone_number: new FormControl(null, [
        optionalMaxLengthValidator(20),
        optionalPhoneNumberValidator(),
      ]),
      fm_employer_details_employer_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      fm_employer_details_employer_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_employer_details_employer_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_employer_details_employer_address_line_4: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_employer_details_employer_address_line_5: new FormControl(null, [
        optionalMaxLengthValidator(30),
        specialCharactersValidator(),
      ]),
      fm_employer_details_employer_post_code: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Performs the initial setup for the employer details form.
   * This method sets up the employer details form, initializes error messages,
   * and repopulates the form with the initial values.
   */
  private initialEmployerDetailsSetup(): void {
    const { formData } = this.finesMacStore.employerDetails();
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialEmployerDetailsSetup();
    super.ngOnInit();
  }
}
