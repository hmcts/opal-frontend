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
import { AbstractFormBaseComponent } from '@components/abstract';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';

import { IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import {
  optionalMaxLengthValidator,
  optionalEmailAddressValidator,
  optionalPhoneNumberValidator,
  specialCharactersValidator,
} from '@validators';
import { FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-employer-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-mac-employer-details-form',
  standalone: true,
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

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_EMPLOYER_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupEmployerDetailsForm(): void {
    this.form = new FormGroup({
      employer_company_name: new FormControl(null, [Validators.required, Validators.maxLength(35)]),
      employer_reference: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      employer_email_address: new FormControl(null, [optionalMaxLengthValidator(76), optionalEmailAddressValidator()]),
      employer_telephone_number: new FormControl(null, [
        optionalMaxLengthValidator(20),
        optionalPhoneNumberValidator(),
      ]),
      employer_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        specialCharactersValidator(),
      ]),
      employer_address_line_2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employer_address_line_3: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employer_address_line_4: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employer_address_line_5: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
      employer_postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
    });
  }

  /**
   * Performs the initial setup for the employer details form.
   * This method sets up the employer details form, initializes error messages,
   * and repopulates the form with the initial values.
   */
  private initialEmployerDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.employerDetails;
    this.setupEmployerDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialEmployerDetailsSetup();
    super.ngOnInit();
  }
}
