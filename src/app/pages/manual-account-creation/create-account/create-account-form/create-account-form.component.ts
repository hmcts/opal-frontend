import { CommonModule } from '@angular/common';
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
  GovukRadiosConditionalComponent,
} from '@components';
import {
  ACCOUNT_TYPES_STATE,
  ACCOUNT_TYPE_DEFENDANT_TYPES_STATE,
  MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELD_ERROR,
} from '@constants';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { IAutoCompleteItem, IFieldErrors, IManualAccountCreationAccountDetailsState } from '@interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-account-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
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

  private accountTypeListener!: Subscription;

  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public readonly routingPaths = RoutingPaths;

  public readonly accountTypes: { key: string; value: string }[] = Object.entries(ACCOUNT_TYPES_STATE).map(
    ([key, value]) => ({ key, value }),
  );
  public readonly fineDefendantTypes: { key: string; value: string }[] = Object.entries(
    ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['fine'],
  ).map(([key, value]) => ({ key, value }));
  public readonly fixedPenaltyDefendantTypes: { key: string; value: string }[] = Object.entries(
    ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['fixedPenalty'],
  ).map(([key, value]) => ({ key, value }));
  public readonly conditionalCautionPenaltyDefendantTypes: { key: string; value: string }[] = Object.entries(
    ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['conditionalCaution'],
  ).map(([key, value]) => ({ key, value }));

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELD_ERROR;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupAccountDetailsForm(): void {
    this.form = new FormGroup({
      accountType: new FormControl(null, [Validators.required]),
      businessUnit: new FormControl(null, [Validators.required]),
      defendantType: new FormControl(null),
      fineDefendantType: new FormControl(null),
      fixedPenaltyDefendantType: new FormControl(null),
    });
  }

  /**
   * Sets up a listener for changes in the account type form control.
   * When the account type changes, it triggers the handleAccountTypeChange method.
   */
  private setupAccountTypeListener(): void {
    this.accountTypeListener = this.form
      .get('accountType')!
      .valueChanges.subscribe(() => this.handleAccountTypeChange());
  }

  /**
   * Handles the change event of the account type form control.
   * Resets error messages and validators based on the selected account type.
   */
  private handleAccountTypeChange(): void {
    this.formErrorSummaryMessage = [];
    this.formControlErrorMessages = {};
    const accountType = this.form.get('accountType')?.value;
    switch (accountType) {
      case 'fine':
        this.resetFormControl('defendantType');
        this.resetFormControl('fixedPenaltyDefendantType');
        this.clearValidatorsAndValidity('fixedPenaltyDefendantType');
        this.setValidatorsAndValidity('fineDefendantType', [Validators.required]);
        break;
      case 'fixedPenalty':
        this.resetFormControl('defendantType');
        this.resetFormControl('fineDefendantType');
        this.clearValidatorsAndValidity('fineDefendantType');
        this.setValidatorsAndValidity('fixedPenaltyDefendantType', [Validators.required]);
        break;
      case 'conditionalCaution':
        this.resetFormControl('fineDefendantType');
        this.clearValidatorsAndValidity('fineDefendantType');
        this.resetFormControl('fixedPenaltyDefendantType');
        this.clearValidatorsAndValidity('fixedPenaltyDefendantType');
        break;
    }
  }

  /**
   * Sets the defendant type based on the selected account type.
   */
  private setDefendantType(): void {
    const accountType = this.form.get('accountType')?.value;
    switch (accountType) {
      case 'fine':
        this.form.get('defendantType')?.setValue(this.form.get('fineDefendantType')?.value);
        break;
      case 'fixedPenalty':
        this.form.get('defendantType')?.setValue(this.form.get('fixedPenaltyDefendantType')?.value);
        break;
      case 'conditionalCaution':
        this.form.get('defendantType')?.setValue(this.conditionalCautionPenaltyDefendantTypes[0].key);
        break;
    }
  }

  /**
   * Handles the form submission event.
   */
  public handleFormSubmit(): void {
    this.setDefendantType();
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
    this.setupAccountTypeListener();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.accountTypeListener.unsubscribe();
    super.ngOnDestroy();
  }
}
