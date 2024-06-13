import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  FormBaseComponent,
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
} from '@components';
import { MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELD_ERROR } from '@constants';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { IFieldErrors, IManualAccountCreationAccountDetailsState } from '@interfaces';
import { DEFENDANT_TYPES_STATE } from 'src/app/constants/defendant-types-state';

@Component({
  selector: 'app-account-details-form',
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
  ],
  templateUrl: './account-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IManualAccountCreationAccountDetailsState>();

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly routingPaths = RoutingPaths;

  public readonly defendantTypes: { key: string; value: string }[] = Object.entries(DEFENDANT_TYPES_STATE).map(
    ([key, value]) => ({ key, value }),
  );

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELD_ERROR;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupAccountDetailsForm(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl(null),
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
    this.rePopulateForm(this.stateService.manualAccountCreation.accountDetails);
    super.ngOnInit();
  }
}
