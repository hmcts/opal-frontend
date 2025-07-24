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
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { IFinesMacPaymentTermsForm } from '../interfaces/fines-mac-payment-terms-form.interface';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths.constant';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-default-days-control-validation';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../constants/fines-mac-payment-terms-options';
import { FinesMacDefaultDaysComponent } from '../../components/fines-mac-default-days/fines-mac-default-days.component';
import { FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS } from '../constants/fines-mac-payment-terms-field-errors';
import { takeUntil } from 'rxjs';
import { IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-all-payment-term-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../constants/fines-mac-payment-terms-frequency-options';
import { FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-all-payment-term-options-control-validation';
import { FINES_MAC_DEFENDANT_TYPES } from '../../constants/fines-mac-defendant-types';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { MojTicketPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-ticket-panel';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { IFinesMacPaymentTermsPermissions } from '../../../../../interfaces/fines-permissions.interfaces';
import { FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS } from '../constants/fines-mac-payment-terms-enforcement-action-options';
import { FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-enforcement-action-options-control-validation';
import { IFinesMacPaymentTermsCollectionOrderOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-collection-order-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_COLLECTION_ORDER_OPTIONS_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-collection-order-options-control-validation';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FINES_MAC_PAYMENT_TERMS_PERMISSIONS } from '../../../../../constants/fines-permissions.constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { ISessionUserStateRole } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { IGovUkRadioOptions } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio/interfaces';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { GovukCancelLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-cancel-link';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesConditionalComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
  GovukRadiosConditionalComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { GovukTextInputPrefixSuffixComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input-prefix-suffix';
import { GovukTextAreaComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-area';
import { dateBeforeValidator } from '@hmcts/opal-frontend-common/validators/date-before';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';

@Component({
  selector: 'app-fines-mac-payment-terms-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GovukButtonComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    GovukRadiosConditionalComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    GovukCheckboxesConditionalComponent,
    GovukCancelLinkComponent,
    GovukTextInputPrefixSuffixComponent,
    FinesMacDefaultDaysComponent,
    GovukErrorSummaryComponent,
    MojDatePickerComponent,
    MojTicketPanelComponent,
    GovukTextAreaComponent,
  ],
  templateUrl: './fines-mac-payment-terms-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacPaymentTermsFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly globalStore = inject(GlobalStore);
  private readonly hasBusinessUnitPermissionAccess = inject(PermissionsService).hasBusinessUnitPermissionAccess;
  private userStateRoles: ISessionUserStateRole[] = [];
  private earliestDateOfSentence = this.finesMacStore.getEarliestDateOfSentence();
  private collectionOrderDateValidator = dateBeforeValidator(this.earliestDateOfSentence);

  @Output() protected override formSubmit = new EventEmitter<IFinesMacPaymentTermsForm>();
  protected readonly dateService = inject(DateService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  protected readonly defendantTypes = FINES_MAC_DEFENDANT_TYPES;

  @Input() public defendantType!: string;
  public readonly permissionsMap = FINES_MAC_PAYMENT_TERMS_PERMISSIONS;
  public readonly permissions: IFinesMacPaymentTermsPermissions = {
    [FINES_MAC_PAYMENT_TERMS_PERMISSIONS['collection-order']]: false,
  };
  override fieldErrors = {
    ...FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS,
  };

  public readonly defendantTypesKeys = FINES_MAC_DEFENDANT_TYPES_KEYS;
  public readonly paymentTermOptions = FINES_MAC_PAYMENT_TERMS_OPTIONS;
  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(this.paymentTermOptions).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly frequencyOptions: IGovUkRadioOptions[] = Object.entries(
    FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS,
  ).map(([key, value]) => ({ key, value }));
  public readonly enforcementActionsOptions = FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS;
  public readonly enforcementActions: IGovUkRadioOptions[] = Object.entries(this.enforcementActionsOptions).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );
  public readonly paymentTermsControls: IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation =
    FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION;
  public readonly collectionOrderControls: IFinesMacPaymentTermsCollectionOrderOptionsControlValidation =
    FINES_MAC_PAYMENT_TERMS_COLLECTION_ORDER_OPTIONS_CONTROL_VALIDATION;
  public yesterday!: string;
  public today!: string;
  public isAdult!: boolean;
  public dateInFuture!: boolean;
  public dateInPast!: boolean;
  public accessDefaultDates!: boolean;
  public accessCollectionOrder!: boolean;

  /**
   * Sets up the permissions for the fines-mac-payment-terms-form component.
   * It checks if the user has permission access for the collection order based on the business unit ID and user roles.
   */
  private setupPermissions(): void {
    this.userStateRoles = this.globalStore.userState()?.business_unit_user || [];
    if (this.userStateRoles && this.userStateRoles.length > 0) {
      this.permissions[this.permissionsMap['collection-order']] = this.hasBusinessUnitPermissionAccess(
        this.permissionsMap['collection-order'],
        this.finesMacStore.getBusinessUnitId(),
        this.userStateRoles,
      );
    }
  }

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      fm_payment_terms_payment_terms: new FormControl<string | null>(null, [Validators.required]),
      fm_payment_terms_collection_order_made: new FormControl<boolean | null>(null),
      fm_payment_terms_collection_order_date: new FormControl<boolean | null>(null),
      fm_payment_terms_collection_order_made_today: new FormControl<boolean | null>(null),
      fm_payment_terms_pay_by_date: new FormControl<boolean | null>(null),
      fm_payment_terms_lump_sum_amount: new FormControl<number | null>(null),
      fm_payment_terms_instalment_amount: new FormControl<number | null>(null),
      fm_payment_terms_instalment_period: new FormControl<boolean | null>(null),
      fm_payment_terms_start_date: new FormControl<boolean | null>(null),
      fm_payment_terms_payment_card_request: new FormControl<boolean | null>(null),
      fm_payment_terms_has_days_in_default: new FormControl<boolean | null>(null),
      fm_payment_terms_suspended_committal_date: new FormControl<boolean | null>(null),
      fm_payment_terms_default_days_in_jail: new FormControl<number | null>(null),
      fm_payment_terms_add_enforcement_action: new FormControl<boolean | null>(null),
      fm_payment_terms_enforcement_action: new FormControl<boolean | null>(null),
      fm_payment_terms_earliest_release_date: new FormControl<boolean | null>(null),
      fm_payment_terms_prison_and_prison_number: new FormControl<boolean | null>(null),
      fm_payment_terms_hold_enforcement_on_account: new FormControl<boolean | null>(null),
      fm_payment_terms_reason_account_is_on_noenf: new FormControl<boolean | null>(null),
    });
  }

  /**
   * Sets up the initial payment terms for the fines-mac-payment-terms-form component.
   * This method performs various setup tasks such as setting up permissions, setting up the payment terms form,
   * adding form controls based on access permissions, adding enforcement fields, setting initial error messages,
   * and populating the form with the provided form data.
   * It also sets the `yesterday` and `today` properties with the appropriate date values.
   */
  private initialPaymentTermsSetup(): void {
    const { formData } = this.finesMacStore.paymentTerms();
    this.setupPermissions();
    this.setupPaymentTermsForm();
    this.paymentTermsListener();
    this.determineAccess();
    this.earliestDateOfSentence = this.finesMacStore.getEarliestDateOfSentence();
    if (this.earliestDateOfSentence) {
      this.collectionOrderDateValidator = dateBeforeValidator(this.earliestDateOfSentence);
    }
    if (this.accessCollectionOrder) {
      this.addCollectionOrderFormControls();
    }
    if (this.accessDefaultDates) {
      this.addDefaultDatesFormControls();
    }
    this.addEnforcementFields();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
    if (formData.fm_payment_terms_collection_order_date) {
      this.handleErrorMessages();
    }
  }

  /**
   * Adds the collection order form controls to the component's form group.
   * This method adds a control for the 'fm_payment_terms_collection_order_made' field
   * and sets the required validator for it.
   * It also registers the listener for changes in the 'fm_payment_terms_collection_order_made' field.
   */
  private addCollectionOrderFormControls(): void {
    this.addControls([
      {
        controlName: 'fm_payment_terms_collection_order_made',
        validators: [Validators.required],
      },
    ]);
    this.hasCollectionOrderListener();
  }

  /**
   * Adds default dates form controls.
   * This method adds form controls for default dates.
   * It adds a control for `fm_payment_terms_has_days_in_default` with no validators.
   * It also calls the `hasDaysInDefaultListener` method.
   */
  private addDefaultDatesFormControls(): void {
    this.addControls([
      {
        controlName: 'fm_payment_terms_has_days_in_default',
        validators: [],
      },
    ]);
    this.hasDaysInDefaultListener();
  }

  /**
   * Adds the payment card control to the form.
   */
  private addRequestPaymentCardControl(): void {
    this.addControls([
      {
        controlName: 'fm_payment_terms_payment_card_request',
        validators: [],
      },
    ]);
  }

  /**
   * Adds enforcement fields based on the defendant type.
   * If the defendant type is a company, it adds the 'fm_payment_terms_hold_enforcement_on_account' control.
   * If the defendant type is not a company, it adds the 'fm_payment_terms_add_enforcement_action' control.
   */
  private addEnforcementFields(): void {
    if (this.defendantTypes[this.defendantType as keyof IFinesMacDefendantTypes] === this.defendantTypes.company) {
      this.addControls([
        {
          controlName: 'fm_payment_terms_hold_enforcement_on_account',
          validators: [],
        },
      ]);
      this.noEnfListener();
    } else {
      this.addControls([
        {
          controlName: 'fm_payment_terms_add_enforcement_action',
          validators: [],
        },
      ]);
      this.addEnforcementActionListener();
    }
  }

  /**
   * Adds a listener to the `fm_payment_terms_add_enforcement_action` control value changes.
   * If the value is `true`, it adds the necessary controls and invokes the `enforcementActionsListener`.
   * If the value is `false`, it removes the unnecessary controls.
   */
  private addEnforcementActionListener(): void {
    const { fm_payment_terms_add_enforcement_action: addEnforcementAction } = this.form.controls;

    addEnforcementAction.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (addEnforcementAction.value !== null) {
        if (addEnforcementAction.value === true) {
          this.addControls([
            {
              controlName: 'fm_payment_terms_enforcement_action',
              validators: [Validators.required],
            },
          ]);
          this.enforcementActionsListener();
        } else {
          this.removeControls([
            {
              controlName: 'fm_payment_terms_enforcement_action',
              validators: [Validators.required],
            },
            { controlName: 'fm_payment_terms_defendant_is_in_custody', validators: [] },
            {
              controlName: 'fm_payment_terms_hold_enforcement_on_account',
              validators: [],
            },
            ...FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION.PRIS.fieldsToRemove,
            ...FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION.NOENF.fieldsToRemove,
          ]);
        }
      }
    });
  }

  /**
   * Listens for changes in the 'fm_payment_terms_collection_order_made' control and performs actions accordingly.
   * This method is responsible for removing and adding controls based on the selected option.
   */
  private hasCollectionOrderListener(): void {
    const { fm_payment_terms_collection_order_made: hasCollectionOrder } = this.form.controls;

    hasCollectionOrder.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((selectedOption) => {
      const controls =
        this.collectionOrderControls[
          selectedOption as keyof IFinesMacPaymentTermsCollectionOrderOptionsControlValidation
        ];

      if (!controls) {
        return;
      }

      this.removeControls(controls.fieldsToRemove);
      this.addControls(controls.fieldsToAdd);

      const collectionOrderDateControl = this.form.get('fm_payment_terms_collection_order_date');
      this.earliestDateOfSentence = this.finesMacStore.getEarliestDateOfSentence();

      if (selectedOption === true && this.earliestDateOfSentence) {
        collectionOrderDateControl?.addValidators(this.collectionOrderDateValidator);
        if (collectionOrderDateControl?.value === null) {
          collectionOrderDateControl?.setValue(
            this.dateService.toDateStringFormat(this.earliestDateOfSentence, 'dd/MM/yyyy'),
          );
        }
      } else {
        collectionOrderDateControl?.removeValidators(this.collectionOrderDateValidator);
      }
    });
  }

  /**
   * Listens for changes in the hasDaysInDefault form control and performs actions accordingly.
   */
  private hasDaysInDefaultListener(): void {
    const { fm_payment_terms_has_days_in_default: hasDaysInDefault } = this.form.controls;

    hasDaysInDefault.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (hasDaysInDefault.value !== null) {
        if (hasDaysInDefault.value === true) {
          this.addControls(FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION);
        } else {
          this.removeControls(FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION);
        }
      }
    });
  }

  /**
   * Listens for changes in the payment terms control and performs actions based on the selected term.
   */
  private paymentTermsListener(): void {
    const { fm_payment_terms_payment_terms: paymentTerms } = this.form.controls;

    paymentTerms.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((selectedTerm) => {
      const controls =
        this.paymentTermsControls[selectedTerm as keyof IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation];

      if (!controls) {
        return;
      }

      this.removeControls(controls.fieldsToRemove);
      this.addControls(controls.fieldsToAdd);
    });
  }

  /**
   * Listens for changes in the specified control and performs a date check.
   *
   * @param controlName - The name of the control to listen for changes.
   */
  private dateListener(controlName: string): void {
    const control = this.form.controls[controlName];

    control.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((value) => {
      this.dateChecker(value);
    });
  }

  /**
   * Listens for changes in the enforcement actions form control and performs corresponding actions.
   */
  private enforcementActionsListener(): void {
    const enforcementActions = this.form.get('fm_payment_terms_enforcement_action');

    enforcementActions!.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      const actionOptions =
        FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION[
          enforcementActions!.value === 'PRIS' ? 'PRIS' : 'NOENF'
        ];

      this.addControls(actionOptions.fieldsToAdd);
      this.removeControls(actionOptions.fieldsToRemove);
    });
  }

  /**
   * Listens for changes in the NOENF form control and performs actions accordingly.
   */
  private noEnfListener(): void {
    const { fm_payment_terms_hold_enforcement_on_account: NOENF } = this.form.controls;

    NOENF.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (NOENF.value !== null) {
        if (NOENF.value === true) {
          this.addControls(FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION.NOENF.fieldsToAdd);
        } else {
          this.removeControls(
            FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION.PRIS.fieldsToRemove,
          );
        }
      }
    });
  }

  /**
   * Checks the validity of a date and sets flags indicating if the date is in the future or in the past.
   * @param dateValue - The date value to be checked.
   */
  private dateChecker(dateValue: string): void {
    this.dateInFuture = false;
    this.dateInPast = false;

    if (this.dateService.isValidDate(dateValue)) {
      this.dateInFuture = this.dateService.isDateInTheFuture(dateValue, 3);
      this.dateInPast = this.dateService.isDateInThePast(dateValue);
    }
  }

  /**
   * Resets the date checker flags to their initial state.
   */
  private resetDateChecker(): void {
    this.dateInFuture = false;
    this.dateInPast = false;
  }

  /**
   * Determines whether the user can access default dates based on the defendant type.
   */
  private determineAccess(): void {
    let formData;
    switch (this.defendantTypes[this.defendantType as keyof IFinesMacDefendantTypes]) {
      case this.defendantTypes.adultOrYouthOnly:
        formData = this.finesMacStore.personalDetails().formData;
        this.accessDefaultDates =
          !formData.fm_personal_details_dob || this.dateService.calculateAge(formData.fm_personal_details_dob) >= 18;
        this.accessCollectionOrder =
          !formData.fm_personal_details_dob || this.dateService.calculateAge(formData.fm_personal_details_dob) >= 18;
        this.addRequestPaymentCardControl();
        break;
      case this.defendantTypes.parentOrGuardianToPay:
        this.accessDefaultDates = true;
        this.accessCollectionOrder = true;
        this.addRequestPaymentCardControl();
        break;
      default:
        this.accessDefaultDates = false;
        this.accessCollectionOrder = false;
    }
  }

  /**
   * Adds the specified controls to the form.
   *
   * @param controlsToAdd - An array of controls to add to the form.
   */
  private addControls(controlsToAdd: IAbstractFormArrayControlValidation[]): void {
    controlsToAdd.forEach((control) => {
      this.updateControl(control.controlName, control.validators);
      if (
        control.controlName === 'fm_payment_terms_start_date' ||
        control.controlName === 'fm_payment_terms_pay_by_date'
      ) {
        this.dateListener(control.controlName);
      }
    });
  }

  /**
   * Removes the specified controls from the form.
   *
   * @param controlsToRemove - An array of `IAbstractFormArrayControlValidation` objects representing the controls to remove.
   */
  private removeControls(controlsToRemove: IAbstractFormArrayControlValidation[]): void {
    controlsToRemove.forEach((control) => {
      const formControl = this.form.get(control.controlName);
      if (formControl) {
        formControl.reset();
      }
      this.removeControl(control.controlName);
      if (
        control.controlName === 'fm_payment_terms_start_date' ||
        control.controlName === 'fm_payment_terms_pay_by_date'
      ) {
        this.resetDateChecker();
      }
    });
  }

  /**
   * Sets the collection order date based on the value of `fm_payment_terms_collection_order_made_today` control.
   */
  private setCollectionOrderDate(): void {
    const makeCollectionOrderTodayControl = this.form.get('fm_payment_terms_collection_order_made_today');
    const collectionOrderDateControl = this.form.get('fm_payment_terms_collection_order_date');

    if (makeCollectionOrderTodayControl?.value === true) {
      collectionOrderDateControl?.setValue(this.today);
    } else if (makeCollectionOrderTodayControl?.value === false) {
      collectionOrderDateControl?.setValue(null);
    }
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    this.setCollectionOrderDate();
    super.handleFormSubmit(event);
  }

  public override ngOnInit(): void {
    this.initialPaymentTermsSetup();
    super.ngOnInit();
  }
}
