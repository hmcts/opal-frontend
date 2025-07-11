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
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IFinesMacCourtDetailsForm } from '../interfaces/fines-mac-court-details-form.interface';
import { FINES_MAC_COURT_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-court-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '../../../constants/fines-patterns.constant';

@Component({
  selector: 'app-fines-mac-court-details-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    GovukTextInputComponent,
    CapitalisationDirective,
  ],
  templateUrl: './fines-mac-court-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacCourtDetailsForm>();
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  @Input() public defendantType!: string;
  @Input({ required: true }) public localJusticeAreas!: IOpalFinesLocalJusticeAreaRefData;
  @Input({ required: true }) public sendingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_COURT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the court details form with the necessary form controls.
   */
  private setupCourtDetailsForm(): void {
    this.form = new FormGroup({
      fm_court_details_originator_id: new FormControl(null, [Validators.required]),
      fm_court_details_prosecutor_case_reference: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(ALPHANUMERIC_WITH_SPACES_PATTERN),
      ]),
      fm_court_details_imposing_court_id: new FormControl(null, [Validators.required]),
      fm_court_details_originator_name: new FormControl(),
    });
  }

  /**
   * Retrieves the name of the originator based on the provided originator ID.
   *
   * @param originatorId - The ID of the originator as a string or null.
   * @returns The name of the originator if found, otherwise an empty string.
   */
  private getOriginatorName(originatorId: string | null): string {
    const originatorIdNumber = Number(originatorId); // Convert string to number
    const court = this.localJusticeAreas.refData.find((court) => court.local_justice_area_id === originatorIdNumber);
    return court ? court.name : '';
  }

  /**
   * Sets the originator name based on the value of the sending court details.
   *
   * This method retrieves the value of the 'fm_court_details_originator_id' form control.
   * If the value is present, it sets the 'fm_court_details_originator_name' form control
   * with the originator name derived from the sending court details.
   *
   * @private
   */
  private setOriginatorName(): void {
    const courtDetailsSendingCourt = this.form.get('fm_court_details_originator_id');

    if (courtDetailsSendingCourt?.value) {
      this.form
        .get('fm_court_details_originator_name')
        ?.setValue(this.getOriginatorName(courtDetailsSendingCourt.value));
    }
  }

  /**
   * Performs the initial setup for the court details form.
   * This method sets up the court details form, initializes error messages,
   * and repopulates the form with the initial court details data.
   */
  private initialCourtDetailsSetup(): void {
    const { formData } = this.finesMacStore.courtDetails();
    this.setupCourtDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    this.setOriginatorName();
    super.handleFormSubmit(event);
  }

  public override ngOnInit(): void {
    this.initialCourtDetailsSetup();
    super.ngOnInit();
  }
}
