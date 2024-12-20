import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormAliasBaseComponent } from '@components/abstract/abstract-form-alias-base/abstract-form-alias-base';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IFinesMacParentGuardianDetailsFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-field-errors.interface';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces/fines-mac-parent-guardian-details-form.interface';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS } from '../constants/fines-mac-parent-guardian-details-alias';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';
import { dateOfBirthValidator } from '@validators/date-of-birth/date-of-birth.validator';
import { nationalInsuranceNumberValidator } from '@validators/national-insurance-number/national-insurance-number.validator';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukSelectComponent } from '@components/govuk/govuk-select/govuk-select.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-field-errors';
import { DateService } from '@services/date-service/date.service';

@Component({
  selector: 'app-fines-mac-parent-guardian-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    MojTicketPanelComponent,
    MojDatePickerComponent,
  ],
  templateUrl: './fines-mac-parent-guardian-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsFormComponent
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  @Output() protected override formSubmit = new EventEmitter<IFinesMacParentGuardianDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);

  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;

  override fieldErrors: IFinesMacParentGuardianDetailsFieldErrors = FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS;

  public yesterday!: string;

  public age!: number;
  public ageLabel!: string;

  /**
   * Sets up the parent/guardian details form with the necessary form controls.
   */
  private setupParentGuardianDetailsForm(): void {
    this.form = new FormGroup({
      fm_parent_guardian_details_forenames: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
        alphabeticalTextValidator(),
      ]),
      fm_parent_guardian_details_surname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        alphabeticalTextValidator(),
      ]),
      fm_parent_guardian_details_aliases: new FormArray([]),
      fm_parent_guardian_details_add_alias: new FormControl(null),
      fm_parent_guardian_details_dob: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
      fm_parent_guardian_details_national_insurance_number: new FormControl(null, [nationalInsuranceNumberValidator()]),
      fm_parent_guardian_details_address_line_1: new FormControl(null, [
        Validators.required,
        Validators.maxLength(25),
        specialCharactersValidator(),
      ]),
      fm_parent_guardian_details_address_line_2: new FormControl(null, [
        optionalMaxLengthValidator(25),
        specialCharactersValidator(),
      ]),
      fm_parent_guardian_details_address_line_3: new FormControl(null, [
        optionalMaxLengthValidator(13),
        specialCharactersValidator(),
      ]),
      fm_parent_guardian_details_post_code: new FormControl(null, [optionalMaxLengthValidator(8)]),
      fm_parent_guardian_details_vehicle_make: new FormControl(null, [optionalMaxLengthValidator(30)]),
      fm_parent_guardian_details_vehicle_registration_mark: new FormControl(null, [optionalMaxLengthValidator(10)]),
    });
  }

  /**
   * Sets up the alias configuration for the parent or guardian details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS;
  }

  /**
   * Sets up the initial parent guardian details.
   * This method initializes the parent guardian details form,
   * sets the initial error messages, and repopulates the form
   * with the existing parent guardian details.
   */
  private initialParentGuardianDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.parentGuardianDetails;
    this.setupParentGuardianDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls(
      [...Array(formData['fm_parent_guardian_details_aliases'].length).keys()],
      'fm_parent_guardian_details_aliases',
    );
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('fm_parent_guardian_details_add_alias', 'fm_parent_guardian_details_aliases');
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  public override ngOnInit(): void {
    this.initialParentGuardianDetailsSetup();
    super.ngOnInit();
  }
}
