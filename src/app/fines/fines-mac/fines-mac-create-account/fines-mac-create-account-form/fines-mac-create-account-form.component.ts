import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  IFinesMacAccountDetailsState,
  IFinesMacAccountTypes,
  IFinesMacCreateAccountControlNames,
} from '../../interfaces';
import { IAutoCompleteItem, IFieldErrors, IRadioOptions } from '@interfaces';
import { Subject, takeUntil } from 'rxjs';
import { FinesMacRoutes } from '../../enums';
import {
  FINES_MAC_ACCOUNT_DETAILS_FIELD_ERROR,
  FINES_MAC_ACCOUNT_TYPES_STATE,
  FINES_MAC_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE,
  FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES,
} from '../../constants';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GovukButtonComponent,
  GovukCancelLinkComponent,
  GovukErrorSummaryComponent,
  GovukHeadingWithCaptionComponent,
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@components/govuk';
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov';
import { FormBaseComponent } from '@components/abstract';
import { RoutingPaths } from '@enums';

@Component({
  selector: 'app-fines-mac-create-account-form',
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
  templateUrl: './fines-mac-create-account-form.component.html',
  styles: ``,
})
export class FinesMacCreateAccountFormComponent extends FormBaseComponent implements OnInit, OnDestroy {
  @Output() private formSubmit = new EventEmitter<IFinesMacAccountDetailsState>();
  @Input({ required: true }) public autoCompleteItems!: IAutoCompleteItem[];

  private ngUnsubscribe = new Subject<void>();

  protected readonly finesMacRoutes = FinesMacRoutes;
  protected readonly routingPath = RoutingPaths;

  public readonly accountTypes: IRadioOptions[] = Object.entries(FINES_MAC_ACCOUNT_TYPES_STATE).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly fineDefendantTypes: IRadioOptions[] = Object.entries(
    FINES_MAC_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['fine'],
  ).map(([key, value]) => ({ key, value }));
  public readonly fixedPenaltyDefendantTypes: IRadioOptions[] = Object.entries(
    FINES_MAC_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['fixedPenalty'],
  ).map(([key, value]) => ({ key, value }));
  public readonly conditionalCautionPenaltyDefendantTypes: IRadioOptions[] = Object.entries(
    FINES_MAC_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE['conditionalCaution'],
  ).map(([key, value]) => ({ key, value }));
  private readonly accountTypeDefendantTypeControlNames: IFinesMacCreateAccountControlNames =
    FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES;

  override fieldErrors: IFieldErrors = FINES_MAC_ACCOUNT_DETAILS_FIELD_ERROR;

  /**
   * Sets up the account details form with the necessary form controls.
   */
  private setupCreateAccountForm(): void {
    this.form = new FormGroup({
      BusinessUnit: new FormControl(null, [Validators.required]),
      AccountType: new FormControl(null, [Validators.required]),
      DefendantType: new FormControl(null),
    });
  }

  /**
   * Sets up a listener for changes in the account type form control.
   * When the account type changes, it triggers the handleAccountTypeChange method.
   */
  private setupAccountTypeListener(): void {
    this.form
      .get('AccountType')!
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((accountType: string) => this.handleAccountTypeChange(accountType));
  }

  /**
   * Handles the change of the account type.
   * @param accountType - The selected account type.
   */
  private handleAccountTypeChange(accountType: string): void {
    const { fieldName, validators, fieldsToRemove } =
      this.accountTypeDefendantTypeControlNames[accountType as keyof IFinesMacAccountTypes] ?? {};

    fieldsToRemove?.forEach((field) => {
      this.removeControl(field);
    });

    if (fieldName && accountType !== 'conditionalCaution') {
      this.createControl(fieldName, validators);
    }
  }

  /**
   * Sets the defendant type based on the selected account type.
   */
  private setDefendantType(): void {
    const accountType = this.form.get('AccountType')?.value;
    const { fieldName } = this.accountTypeDefendantTypeControlNames[accountType as keyof IFinesMacAccountTypes] ?? '';
    const fieldValue = this.form.get(fieldName)?.value;

    const defendantTypeMap: IFinesMacAccountTypes = {
      fine: fieldValue,
      fixedPenalty: fieldValue,
      conditionalCaution: this.conditionalCautionPenaltyDefendantTypes[0].key,
    };

    this.form.get('DefendantType')?.setValue(defendantTypeMap[accountType as keyof IFinesMacAccountTypes]);
  }

  /**
   * Performs the initial setup for the create account form.
   * This method sets up the create account form, initializes error messages,
   * sets up the account type listener, and repopulates the form with account details.
   */
  private initialSetup(): void {
    this.setupCreateAccountForm();
    this.setInitialErrorMessages();
    this.setupAccountTypeListener();
    this.rePopulateForm(this.finesService.finesMacState.accountDetails);
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
    this.initialSetup();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    super.ngOnDestroy();
  }
}
