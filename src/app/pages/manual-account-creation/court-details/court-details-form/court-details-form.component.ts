import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlphagovAccessibleAutocompleteComponent,
  FormBaseComponent,
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components';
import { MANUAL_ACCOUNT_CREATION_COURT_DETAILS_FIELD_ERRORS, MANUAL_ACCOUNT_CREATION_NESTED_ROUTES } from '@constants';
import { ManualAccountCreationRoutes } from '@enums';
import { IAutoCompleteItem, IFieldErrors, IManualAccountCreationCourtDetailsForm } from '@interfaces';

@Component({
  selector: 'app-court-details-form',
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
  templateUrl: './court-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourtDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Input() public defendantType!: string;
  @Input({ required: true }) public sendingCourtAutoCompleteItems!: IAutoCompleteItem[];
  @Input({ required: true }) public enforcingCourtAutoCompleteItems!: IAutoCompleteItem[];
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationCourtDetailsForm>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly manualAccountCreationNestedRoutes = MANUAL_ACCOUNT_CREATION_NESTED_ROUTES;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_COURT_DETAILS_FIELD_ERRORS;

  /**
   * Sets up the court details form with the necessary form controls.
   */
  private setupCourtDetailsForm(): void {
    this.form = new FormGroup({
      SendingCourt: new FormControl(null, [Validators.required]),
      ProsecutorCaseReference: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9 ]*$/),
      ]),
      EnforcingCourt: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns void
   */
  public handleFormSubmit(event: SubmitEvent): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      const nestedFlow = event.submitter ? event.submitter.className.includes('nested-flow') : false;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit({ formData: this.form.value, nestedFlow: nestedFlow });
    }
  }

  public override ngOnInit(): void {
    this.setupCourtDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.courtDetails);
    super.ngOnInit();
  }
}
