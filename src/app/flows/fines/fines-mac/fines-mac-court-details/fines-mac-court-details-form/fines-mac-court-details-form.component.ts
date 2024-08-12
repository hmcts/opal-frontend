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
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukTextInputComponent,
} from '@components/govuk';
import { FINES_MAC_NESTED_ROUTES } from '@constants/fines/mac';
import { FinesMacRoutes } from '@enums/fines/mac';
import { IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';
import { IAlphagovAccessibleAutocompleteItem } from 'src/app/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { IFinesMacCourtDetailsForm } from '../interfaces';
import { FinesService } from '@services/fines';
import { FINES_MAC_COURT_DETAILS_FIELD_ERRORS } from '../constants';

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
  @Output() private formSubmit = new EventEmitter<IFinesMacCourtDetailsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly finesMacRoutes = FinesMacRoutes;
  protected readonly finesMacNestedRoutes = FINES_MAC_NESTED_ROUTES;

  override fieldErrors: IAbstractFormBaseFieldErrors = FINES_MAC_COURT_DETAILS_FIELD_ERRORS;

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
   * Performs the initial setup for the court details form.
   * This method sets up the court details form, initializes error messages,
   * and repopulates the form with the initial court details data.
   */
  private initialSetup(): void {
    this.setupCourtDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.finesService.finesMacState.courtDetails);
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
    this.initialSetup();
    super.ngOnInit();
  }
}
