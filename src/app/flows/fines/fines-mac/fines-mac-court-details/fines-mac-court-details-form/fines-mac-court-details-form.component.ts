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
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukTextInputComponent } from '@components/govuk/govuk-text-input/govuk-text-input.component';

import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { IAlphagovAccessibleAutocompleteItem } from '@components/alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { IFinesMacCourtDetailsForm } from '../interfaces/fines-mac-court-details-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_COURT_DETAILS_FIELD_ERRORS } from '../constants/fines-mac-court-details-field-errors';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../../routing/constants/fines-mac-routing-nested-routes';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';

@Component({
  selector: 'app-fines-mac-court-details-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AlphagovAccessibleAutocompleteComponent,
    GovukButtonComponent,
    GovukCancelLinkComponent,
    GovukTextInputComponent,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './fines-mac-court-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCourtDetailsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Input({ required: true }) public sendingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  @Output() protected override formSubmit = new EventEmitter<IFinesMacCourtDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly finesMacNestedRoutes = FINES_MAC_ROUTING_NESTED_ROUTES;

  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_COURT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the court details form with the necessary form controls.
   */
  private setupCourtDetailsForm(): void {
    this.form = new FormGroup({
      fm_court_details_sending_court: new FormControl(null, [Validators.required]),
      fm_court_details_prosecutor_case_reference: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9 ]*$/),
      ]),
      fm_court_details_enforcing_court: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Performs the initial setup for the court details form.
   * This method sets up the court details form, initializes error messages,
   * and repopulates the form with the initial court details data.
   */
  private initialCourtDetailsSetup(): void {
    const { formData } = this.finesService.finesMacState.courtDetails;
    this.setupCourtDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
  }

  public override ngOnInit(): void {
    this.initialCourtDetailsSetup();
    super.ngOnInit();
  }
}
