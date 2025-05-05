import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { IFinesMacOffenceDetailsSearchOffencesForm } from '../../interfaces/fines-mac-offence-details-search-offences-form.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ERRORS } from '../../constants/fines-mac-offence-details-search-offences-errors.constant';
import { FinesMacOffenceDetailsSearchOffencesStore } from '../../stores/fines-mac-offence-details-search-offences.store';
import { alphabeticalTextValidator } from '@hmcts/opal-frontend-common/validators/alphabetical-text';
import { specialCharactersValidator } from '@hmcts/opal-frontend-common/validators/special-characters';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences-search-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukTextAreaComponent,
    GovukTextInputComponent,
    GovukCheckboxesItemComponent,
    GovukErrorSummaryComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-offence-details-search-offences-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesSearchFormComponent
  extends AbstractFormBaseComponent
  implements OnInit, OnDestroy
{
  @Output() protected override formSubmit = new EventEmitter<IFinesMacOffenceDetailsSearchOffencesForm>();

  private readonly finesMacOffenceDetailsSearchOffencesStore = inject(FinesMacOffenceDetailsSearchOffencesStore);

  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ERRORS;

  /**
   * Initializes the `form` property with a `FormGroup` containing controls for searching offence details.
   * Each control is configured with specific validators to enforce input constraints.
   *
   * Form Controls:
   * - `fm_offence_details_search_offences_code`: A text field with a maximum length of 8 characters,
   *   validated to allow only alphabetical text.
   * - `fm_offence_details_search_offences_short_title`: A text field with a maximum length of 120 characters,
   *   validated to allow only alphabetical text.
   * - `fm_offence_details_search_offences_act_section`: A text field with a maximum length of 4000 characters,
   *   validated to allow only alphabetical text.
   * - `fm_offence_details_search_offences_inactive`: A boolean field initialized to `false`.
   *
   * This method is used to set up the form structure and validation rules for the offence details search functionality.
   */
  private setupOffenceDetailsSearchOffencesForm(): void {
    this.form = new FormGroup({
      fm_offence_details_search_offences_code: new FormControl(null, [
        Validators.maxLength(8),
        alphabeticalTextValidator(),
        specialCharactersValidator(),
      ]),
      fm_offence_details_search_offences_short_title: new FormControl(null, [
        Validators.maxLength(120),
        alphabeticalTextValidator(),
        specialCharactersValidator(),
      ]),
      fm_offence_details_search_offences_act_section: new FormControl(null, [
        Validators.maxLength(4000),
        alphabeticalTextValidator(),
        specialCharactersValidator(),
      ]),
      fm_offence_details_search_offences_inactive: new FormControl(false),
    });
  }

  /**
   * Initializes the setup process for the "Search Offences" feature.
   *
   * This method performs the following actions:
   * 1. Retrieves the initial form data from the `finesMacOffenceDetailsSearchOffencesStore`.
   * 2. Sets up the offence details search offences form.
   * 3. Configures the initial error messages for the form.
   * 4. Populates the form with the retrieved data.
   *
   * @private
   */
  private initialSearchOffencesSetup(): void {
    const { formData } = this.finesMacOffenceDetailsSearchOffencesStore.searchOffences();
    this.setupOffenceDetailsSearchOffencesForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialSearchOffencesSetup();
    super.ngOnInit();
  }
}
