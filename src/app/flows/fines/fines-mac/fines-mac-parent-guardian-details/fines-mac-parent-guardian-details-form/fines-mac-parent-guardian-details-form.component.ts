import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AbstractFormAliasBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-alias-base';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IFinesMacParentGuardianDetailsFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-field-errors.interface';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces/fines-mac-parent-guardian-details-form.interface';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS } from '../constants/fines-mac-parent-guardian-details-alias';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-parent-guardian-details-field-errors';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
  GovukCheckboxesComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { nationalInsuranceNumberValidator } from '@hmcts/opal-frontend-common/validators/national-insurance-number';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';
import { specialCharactersValidator } from '@hmcts/opal-frontend-common/validators/special-characters';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { LETTERS_WITH_SPACES_PATTERN } from '../../../constants/fines-patterns.constant';

@Component({
  selector: 'app-fines-mac-parent-guardian-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukCancelLinkComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukTextInputComponent,
    MojTicketPanelComponent,
    MojDatePickerComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-parent-guardian-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacParentGuardianDetailsFormComponent
  extends AbstractFormAliasBaseComponent
  implements OnInit, OnDestroy
{
  private readonly finesMacStore = inject(FinesMacStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacParentGuardianDetailsForm>();
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
        patternValidator(LETTERS_WITH_SPACES_PATTERN),
      ]),
      fm_parent_guardian_details_surname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        patternValidator(LETTERS_WITH_SPACES_PATTERN),
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
    const { formData } = this.finesMacStore.parentGuardianDetails();
    this.setupParentGuardianDetailsForm();
    this.setupAliasConfiguration();
    this.setupAliasFormControls(
      [...Array(formData.fm_parent_guardian_details_aliases.length).keys()],
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
