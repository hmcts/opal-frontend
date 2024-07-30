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
  MANUAL_ACCOUNT_CREATION_ACCOUNT_TYPE_DEFENDANT_TYPE_CONTROL_NAMES,
} from '@constants';
import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import {
  IAccountTypeDefendantTypeControlNames,
  IAccountTypes,
  IAutoCompleteItem,
  IFieldErrors,
  IManualAccountCreationAccountDetailsState,
  IRadioOptions,
} from '@interfaces';
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

  public readonly accountTypes: IRadioOptions[] = Object.entries(ACCOUNT_TYPES_STATE).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly fineDefendantTypes: IRadioOptions[] = Object.entries(ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['fine']).map(
    ([key, value]) => ({ key, value }),
  );
  public readonly fixedPenaltyDefendantTypes: IRadioOptions[] = Object.entries(
    ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['fixedPenalty'],
  ).map(([key, value]) => ({ key, value }));
  public readonly conditionalCautionPenaltyDefendantTypes: IRadioOptions[] = Object.entries(
    ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['conditionalCaution'],
  ).map(([key, value]) => ({ key, value }));
  private readonly accountTypeDefendantTypeControlNames: IAccountTypeDefendantTypeControlNames =
    MANUAL_ACCOUNT_CREATION_ACCOUNT_TYPE_DEFENDANT_TYPE_CONTROL_NAMES;

  override fieldErrors: IFieldErrors = MANUAL_ACCOUNT_CREATION_ACCOUNT_DETAILS_FIELD_ERROR;

  /**
   * Sets up the employer details form with the necessary form controls.
   */
  private setupAccountDetailsForm(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl(null, [Validators.required]),
      accountType: new FormControl(null, [Validators.required]),
      defendantType: new FormControl(null),
    });
  }

  /**
   * Sets up a listener for changes in the account type form control.
   * When the account type changes, it triggers the handleAccountTypeChange method.
   */
  private setupAccountTypeListener(): void {
    this.accountTypeListener = this.form
      .get('accountType')!
      .valueChanges.subscribe((accountType: string) => this.handleAccountTypeChange(accountType));
  }

  /**
   * Handles the change of the account type.
   * @param accountType - The selected account type.
   */
  private handleAccountTypeChange(accountType: string): void {
    const { fieldName, validators, fieldsToRemove } =
      this.accountTypeDefendantTypeControlNames[accountType as keyof IAccountTypes] ?? {};

    fieldsToRemove?.forEach((field) => {
      this.removeControl(field);
    });

    if (accountType !== 'conditionalCaution') {
      this.createControl(fieldName, validators);
    }
  }

  /**
   * Sets the defendant type based on the selected account type.
   */
  private setDefendantType(): void {
    const accountType = this.form.get('accountType')?.value;
    const { fieldName } = this.accountTypeDefendantTypeControlNames[accountType as keyof IAccountTypes] ?? '';
    const fieldValue = this.form.get(fieldName)?.value;

    const defendantTypeMap: IAccountTypes = {
      fine: fieldValue,
      fixedPenalty: fieldValue,
      conditionalCaution: this.conditionalCautionPenaltyDefendantTypes[0].key,
    };

    this.form.get('defendantType')?.setValue(defendantTypeMap[accountType as keyof IAccountTypes]);
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
    this.setupAccountTypeListener();
    this.rePopulateForm(this.macStateService.manualAccountCreation.accountDetails);
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.accountTypeListener.unsubscribe();
    super.ngOnDestroy();
  }
}
