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
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IFinesMacCreateAccountControlNames } from '../interfaces/fines-mac-create-account-control-names.interface';
import { IFinesMacCreateAccountFieldErrors } from '../interfaces/fines-mac-create-account-field-errors.interface';
import { FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPES } from '../constants/fines-mac-create-account-account-types';
import { FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE } from '../constants/fines-mac-create-account-account-type-defendant-types-state';
import { FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES } from '../constants/fines-mac-create-account-control-names';
import { FINES_MAC_CREATE_ACCOUNT_FIELD_ERRORS } from '../constants/fines-mac-create-account-field-errors';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { IFinesMacAccountTypes } from '../../interfaces/fines-mac-account-types.interface';
import { IFinesMacAccountDetailsForm } from '../../fines-mac-account-details/interfaces/fines-mac-account-details-form.interface';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { GovukHeadingWithCaptionComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-heading-with-caption';
import {
  GovukRadioComponent,
  GovukRadiosConditionalComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { FINES_MAC_ACCOUNT_TYPES_KEYS } from '../../constants/fines-mac-account-types-keys';
@Component({
  selector: 'app-fines-mac-create-account-form',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacCreateAccountFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly accountTypeSubject = new Subject<void>();
  private readonly accountTypeDefendantTypeControlNames: IFinesMacCreateAccountControlNames =
    FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES;

  @Output() protected override formSubmit = new EventEmitter<IFinesMacAccountDetailsForm>();
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly routingPath = PAGES_ROUTING_PATHS;

  @Input({ required: true }) public autoCompleteItems!: IAlphagovAccessibleAutocompleteItem[];
  public readonly accountTypes: IGovUkRadioOptions[] = Object.entries(FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPES).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );
  public readonly accountTypesKeys = FINES_MAC_ACCOUNT_TYPES_KEYS;
  public readonly fineDefendantTypes: IGovUkRadioOptions[] = Object.entries(
    FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE[FINES_MAC_ACCOUNT_TYPES_KEYS.fine],
  ).map(([key, value]) => ({ key, value }));
  public readonly fixedPenaltyDefendantTypes: IGovUkRadioOptions[] = Object.entries(
    FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE[FINES_MAC_ACCOUNT_TYPES_KEYS.fixedPenalty],
  ).map(([key, value]) => ({ key, value }));
  public readonly conditionalCautionPenaltyDefendantTypes: IGovUkRadioOptions[] = Object.entries(
    FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE[FINES_MAC_ACCOUNT_TYPES_KEYS.conditionalCaution],
  ).map(([key, value]) => ({ key, value }));
  override fieldErrors: IFinesMacCreateAccountFieldErrors = FINES_MAC_CREATE_ACCOUNT_FIELD_ERRORS;

  /**
   * Sets up the account details form with the necessary form controls.
   */
  private setupCreateAccountForm(): void {
    this.form = new FormGroup({
      fm_create_account_business_unit_id: new FormControl(null, [Validators.required]),
      fm_create_account_account_type: new FormControl(null, [Validators.required]),
      fm_create_account_defendant_type: new FormControl(null),
    });
  }

  /**
   * Sets up a listener for changes in the account type form control.
   * When the account type changes, it triggers the handleAccountTypeChange method.
   */
  private setupAccountTypeListener(): void {
    this.form
      .get('fm_create_account_account_type')!
      .valueChanges.pipe(takeUntil(this.accountTypeSubject))
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

    if (fieldName && accountType !== FINES_MAC_ACCOUNT_TYPES_KEYS.conditionalCaution) {
      this.createControl(fieldName, validators);
    }
  }

  /**
   * Sets the defendant type based on the selected account type.
   */
  private setDefendantType(): void {
    const accountType = this.form.get('fm_create_account_account_type')?.value;
    const { fieldName } = this.accountTypeDefendantTypeControlNames[accountType as keyof IFinesMacAccountTypes] ?? '';
    const fieldValue = this.form.get(fieldName)?.value;

    const defendantTypeMap: IFinesMacAccountTypes = {
      fine: fieldValue,
      fixedPenalty: fieldValue,
      conditionalCaution: this.conditionalCautionPenaltyDefendantTypes[0].key,
    };

    this.form
      .get('fm_create_account_defendant_type')
      ?.setValue(defendantTypeMap[accountType as keyof IFinesMacAccountTypes]);
  }

  /**
   * Performs the initial setup for the create account form.
   * This method sets up the create account form, initializes error messages,
   * sets up the account type listener, and repopulates the form with account details.
   */
  private initialCreateAccountSetup(): void {
    const { formData } = this.finesMacStore.accountDetails();
    this.setupCreateAccountForm();
    this.setInitialErrorMessages();
    this.setupAccountTypeListener();
    this.rePopulateForm(formData);
  }

  /**
   * Handles the form submission event.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    this.setDefendantType();
    super.handleFormSubmit(event);
  }

  public override ngOnInit(): void {
    this.initialCreateAccountSetup();
    super.ngOnInit();
  }

  public override ngOnDestroy(): void {
    this.accountTypeSubject.next();
    this.accountTypeSubject.complete();
    super.ngOnDestroy();
  }
}
