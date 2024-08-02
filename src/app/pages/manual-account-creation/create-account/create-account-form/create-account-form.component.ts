import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FormBaseComponent,
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  AlphagovAccessibleAutocompleteComponent,
} from '@components';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { IAutoCompleteItem, IFieldErrors, IManualAccountCreationAccountDetailsState } from '@interfaces';
import { DEFENDANT_TYPES_STATE } from 'src/app/constants/defendant-types-state';
import { MANUAL_ACCOUNT_CREATION_CREATE_ACCOUNT_FIELD_ERROR } from '../constants/manual-account-creation-account-details-field-errors';

@Component({
  selector: 'app-create-account-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukHeadingWithCaptionComponent,
    GovukCancelLinkComponent,
    GovukErrorSummaryComponent,
    AlphagovAccessibleAutocompleteComponent,
  ],
  templateUrl: './create-account-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationAccountDetailsState>();
  @Input({ required: true }) public autoCompleteItems!: IAutoCompleteItem[];

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly routingPaths = RoutingPaths;

  public readonly defendantTypes: { key: string; value: string }[] = Object.entries(DEFENDANT_TYPES_STATE).map(
    ([key, value]) => ({ key, value }),
  );

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_CREATE_ACCOUNT_FIELD_ERROR;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupAccountDetailsForm(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl(null, [Validators.required]),
      defendantType: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.handleErrorMessages();

    if (this.form.valid) {
      this.formSubmitted = true;
      this.unsavedChanges.emit(this.hasUnsavedChanges());
      this.formSubmit.emit(this.form.value);
    }
  }

  public override ngOnInit(): void {
    this.setupAccountDetailsForm();
    this.setInitialErrorMessages();
    this.rePopulateForm(this.macStateService.manualAccountCreation.accountDetails);
    super.ngOnInit();
  }
}
