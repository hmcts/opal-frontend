import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukSelectComponent } from '@components/govuk/govuk-select/govuk-select.component';
import { IConfiscationPersonalDetailsFieldErrors } from '../interfaces/confiscation-personal-details-field-errors.interface';
import { IConfiscationPersonalDetailsForm } from '../interfaces/confiscation-personal-details-form.interface';
import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';
import { CONFISCATION_PERSONAL_DETAILS_FIELD_ERRORS } from '../constants/confiscation-personal-details-field-errors';
import { CONFISCATION_PERSONAL_DETAILS_ALIAS } from '../constants/confiscation-personal-details-alias';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { CONFISCATION_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as CONF_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/confiscation-personal-details-vehicle-details-fields';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { ConfiscationStore } from '../../stores/confiscation.store';
import { AbstractPersonalDetailsComponent } from 'src/app/flows/components/abstract/abstract-personal-details/abstract-personal-details';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { ABSTRACT_TITLE_DROPDOWN_OPTIONS } from 'src/app/flows/components/abstract/constants/abstract-title-dropdown-options.constant';

@Component({
  selector: 'app-confiscation-personal-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukErrorSummaryComponent,
    GovukSelectComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    MojTicketPanelComponent,
    MojDatePickerComponent,
  ],
  templateUrl: './confiscation-personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiscationPersonalDetailsFormComponent
  extends AbstractPersonalDetailsComponent
  implements OnInit, OnDestroy
{
  @Output() protected override formSubmit = new EventEmitter<IConfiscationPersonalDetailsForm>();

  private readonly confiscationStore = inject(ConfiscationStore);
  protected readonly pagesRoutingPath = PAGES_ROUTING_PATHS;

  override fieldErrors: IConfiscationPersonalDetailsFieldErrors = {
    ...CONFISCATION_PERSONAL_DETAILS_FIELD_ERRORS,
  };

  protected override vehicleDetailsFields = CONF_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS;

  public readonly titleOptions: IGovUkSelectOptions[] = ABSTRACT_TITLE_DROPDOWN_OPTIONS;
  public yesterday!: string;

  /**
   * Sets up the alias configuration for the personal details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = CONFISCATION_PERSONAL_DETAILS_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = CONFISCATION_PERSONAL_DETAILS_ALIAS;
  }

  /**
   * Sets up the initial personal details for the confiscation-personal-details-form component.
   * This method initializes the personal details form, alias configuration, alias form controls,
   * adds vehicle details field errors if the defendant type is 'adultOrYouthOnly', sets initial
   * error messages, repopulates the form with personal details, and sets up the alias checkbox listener.
   */
  private initialPersonalDetailsSetup(): void {
    const { formData } = this.confiscationStore.personalDetails();
    this.setupPersonalDetailsForm('conf');
    this.dateOfBirthControl = this.form.get('conf_personal_details_dob')!;

    this.setupAliasConfiguration();
    this.setupAliasFormControls(
      [...Array(formData.conf_personal_details_aliases.length).keys()],
      'conf_personal_details_aliases',
    );
    this['addVehicleDetailsControls']();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('conf_personal_details_add_alias', 'conf_personal_details_aliases');
    this.dateOfBirthListener();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  public override ngOnInit(): void {
    this.initialPersonalDetailsSetup();
    super.ngOnInit();
  }
}
