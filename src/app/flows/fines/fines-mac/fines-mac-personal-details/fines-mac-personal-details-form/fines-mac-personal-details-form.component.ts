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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukSelectComponent } from '@components/govuk/govuk-select/govuk-select.component';
import { IFinesMacPersonalDetailsFieldErrors } from '../interfaces/fines-mac-personal-details-field-errors.interface';
import { IFinesMacPersonalDetailsForm } from '../interfaces/fines-mac-personal-details-form.interface';
import { IGovUkSelectOptions } from '@components/govuk/govuk-select/interfaces/govuk-select-options.interface';
import { FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-personal-details-field-errors';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS } from '../constants/fines-mac-personal-details-alias';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';
import { FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/fines-mac-personal-details-vehicle-details-fields';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { AbstractPersonalDetailsComponent } from 'src/app/flows/components/abstract/abstract-personal-details/abstract-personal-details';
import { ABSTRACT_TITLE_DROPDOWN_OPTIONS } from 'src/app/flows/components/abstract/constants/abstract-title-dropdown-options.constant';

@Component({
  selector: 'app-fines-mac-personal-details-form',
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
  templateUrl: './fines-mac-personal-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPersonalDetailsFormComponent
  extends AbstractPersonalDetailsComponent
  implements OnInit, OnDestroy
{
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPersonalDetailsForm>();

  private readonly finesMacStore = inject(FinesMacStore);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IFinesMacPersonalDetailsFieldErrors = {
    ...FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS,
  };
  protected override vehicleDetailsFields = FM_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS;

  public readonly titleOptions: IGovUkSelectOptions[] = ABSTRACT_TITLE_DROPDOWN_OPTIONS;
  public yesterday!: string;

  /**
   * Sets up the alias configuration for the personal details form.
   * The alias configuration includes the alias fields and controls validation.
   */
  private setupAliasConfiguration(): void {
    this.aliasFields = FINES_MAC_PERSONAL_DETAILS_ALIAS.map((control) => control.controlName);
    this.aliasControlsValidation = FINES_MAC_PERSONAL_DETAILS_ALIAS;
  }

  /**
   * Updates the age and age label based on the provided date of birth.
   *
   * @param dateOfBirth - The date of birth in string format.
   */
  protected override updateAgeAndLabel(dateOfBirth: string): void {
    super.updateAgeAndLabel(dateOfBirth);
    if (this.dateService.isValidDate(dateOfBirth)) {
      this.finesMacStore.resetPaymentTermsDaysInDefault();
    }
  }

  /**
   * Sets up the initial personal details for the fines-mac-personal-details-form component.
   * This method initializes the personal details form, alias configuration, alias form controls,
   * adds vehicle details field errors if the defendant type is 'adultOrYouthOnly', sets initial
   * error messages, repopulates the form with personal details, and sets up the alias checkbox listener.
   */
  private initialPersonalDetailsSetup(): void {
    const { formData } = this.finesMacStore.personalDetails();
    const key = this.defendantType as keyof IFinesMacDefendantTypes;
    this.setupPersonalDetailsForm('fm');
    this.dateOfBirthControl = this.form.get('fm_personal_details_dob')!;

    this.setupAliasConfiguration();
    this.setupAliasFormControls(
      [...Array(formData.fm_personal_details_aliases.length).keys()],
      'fm_personal_details_aliases',
    );
    if (key === 'adultOrYouthOnly') {
      this.addVehicleDetailsControls();
    }
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.setUpAliasCheckboxListener('fm_personal_details_add_alias', 'fm_personal_details_aliases');
    this.dateOfBirthListener();
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
  }

  public override ngOnInit(): void {
    this.initialPersonalDetailsSetup();
    super.ngOnInit();
  }
}
