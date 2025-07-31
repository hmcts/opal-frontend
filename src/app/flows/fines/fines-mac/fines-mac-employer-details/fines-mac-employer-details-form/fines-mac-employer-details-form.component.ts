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
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-employer-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { optionalPhoneNumberValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-telephone';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { SPECIAL_CHARACTERS_PATTERN, EMAIL_ADDRESS_PATTERN } from '../../../constants/fines-patterns.constant';

@Component({
  selector: 'app-fines-mac-employer-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-employer-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacEmployerDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacEmployerDetailsForm>();
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  @Input() public defendantType!: string;
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
        patternValidator(EMAIL_ADDRESS_PATTERN, 'emailPattern'),
      ]),
      fm_employer_details_employer_telephone_number: new FormControl(null, [
        optionalMaxLengthValidator(20),
        optionalPhoneNumberValidator(),
      ]),
      fm_employer_details_employer_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        patternValidator(SPECIAL_CHARACTERS_PATTERN, 'specialCharactersPattern'),
      ]),
      fm_employer_details_employer_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(30),
        patternValidator(SPECIAL_CHARACTERS_PATTERN),
      ]),
      fm_employer_details_employer_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(30),
        patternValidator(SPECIAL_CHARACTERS_PATTERN, 'specialCharactersPattern'),
      ]),
      fm_employer_details_employer_address_line_4: new FormControl(null, [
        optionalMaxLengthValidator(30),
        patternValidator(SPECIAL_CHARACTERS_PATTERN, 'specialCharactersPattern'),
      ]),
      fm_employer_details_employer_address_line_5: new FormControl(null, [
        optionalMaxLengthValidator(30),
        patternValidator(SPECIAL_CHARACTERS_PATTERN, 'specialCharactersPattern'),
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
