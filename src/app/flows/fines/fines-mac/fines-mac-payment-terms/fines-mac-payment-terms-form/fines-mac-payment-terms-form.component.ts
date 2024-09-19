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
import { AbstractFormBaseComponent } from '@components/abstract/abstract-form-base/abstract-form-base.component';
import { IFinesMacPaymentTermsFieldErrors } from '../interfaces/fines-mac-payment-terms-field-errors.interface';
import { IFinesMacPaymentTermsForm } from '../interfaces/fines-mac-payment-terms-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ROUTING_PATHS } from '../../routing/constants/fines-mac-routing-paths';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IGovUkRadioOptions } from '@components/govuk/govuk-radio/interfaces/govuk-radio-options.interface';
import { CommonModule } from '@angular/common';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukCancelLinkComponent } from '@components/govuk/govuk-cancel-link/govuk-cancel-link.component';
import { GovukCheckboxesComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes.component';
import { GovukCheckboxesConditionalComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-conditional/govuk-checkboxes-conditional.component';
import { GovukCheckboxesItemComponent } from '@components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { GovukRadioComponent } from '@components/govuk/govuk-radio/govuk-radio.component';
import { GovukRadiosItemComponent } from '@components/govuk/govuk-radio/govuk-radios-item/govuk-radios-item.component';
import { GovukTextInputPrefixSuffixComponent } from '@components/govuk/govuk-text-input-prefix-suffix/govuk-text-input-prefix-suffix.component';
import { FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-default-days-control-validation';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../constants/fines-mac-payment-terms-options';
import { FinesMacDefaultDaysComponent } from '../../components/fines-mac-default-days/fines-mac-default-days.component';
import { FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS } from '../constants/fines-mac-payment-terms-field-errors';
import { takeUntil } from 'rxjs';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAYMENT_TERMS as PT_CONTROL_PAYMENT_TERMS } from '../constants/controls/fines-mac-payment-terms-controls-payment-terms.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REQUEST_CARD_PAYMENT as PT_CONTROL_REQUEST_CARD_PAYMENT } from '../constants/controls/fines-mac-payment-terms-controls-request-card-payment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_DAYS_IN_DEFAULT as PT_CONTROL_HAS_DAYS_IN_DEFAULT } from '../constants/controls/fines-mac-payment-terms-controls-has-days-in-default.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_ADD_ENFORCEMENT_ACTION as PT_CONTROL_ADD_ENFORCEMENT_ACTION } from '../constants/controls/fines-mac-payment-terms-controls-add-enforcement-action.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAY_BY_DATE as PT_CONTROL_PAY_BY_DATE } from '../constants/controls/fines-mac-payment-terms-controls-pay-by-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_LUMP_SUM as PT_CONTROL_LUMP_SUM } from '../constants/controls/fines-mac-payment-terms-controls-lump-sum.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_INSTALMENT as PT_CONTROL_INSTALMENT } from '../constants/controls/fines-mac-payment-terms-controls-instalment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_FREQUENCY as PT_CONTROL_FREQUENCY } from '../constants/controls/fines-mac-payment-terms-controls-frequency.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_START_DATE as PT_CONTROL_START_DATE } from '../constants/controls/fines-mac-payment-terms-controls-start-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT as PT_CONTROL_DAYS_IN_DEFAULT } from '../constants/controls/fines-mac-payment-terms-controls-days-in-default.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT_DATE as PT_CONTROL_DAYS_IN_DEFAULT_DATE } from '../constants/controls/fines-mac-payment-terms-controls-days-in-default-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_COLLECTION_ORDER as PT_CONTROL_HAS_COLLECTION_ORDER } from '../constants/controls/fines-mac-payment-terms-controls-has-collection-order.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_COLLECTION_ORDER_DATE as PT_CONTROL_COLLECTION_ORDER_DATE } from '../constants/controls/fines-mac-payment-terms-controls-collection-order-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_MAKE_COLLECTION_ORDER_TODAY as PT_CONTROL_MAKE_COLLECTION_ORDER_TODAY } from '../constants/controls/fines-mac-payment-terms-controls-make-collection-order-today.constant';
import { IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-all-payment-term-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../constants/fines-mac-payment-terms-frequency-options';
import { FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION } from '../constants/fines-mac-payment-terms-all-payment-term-options-control-validation';
import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-payment-term-options-control-validation.interface';
import { FINES_MAC_DEFENDANT_TYPES } from '../../constants/fines-mac-defendant-types';
import { IFinesMacDefendantTypes } from '../../interfaces/fines-mac-defendant-types.interface';
import { GovukRadiosConditionalComponent } from '@components/govuk/govuk-radio/govuk-radios-conditional/govuk-radios-conditional.component';
import { MojTicketPanelComponent } from '@components/moj/moj-ticket-panel/moj-ticket-panel.component';
import { MojDatePickerComponent } from '@components/moj/moj-date-picker/moj-date-picker.component';
import { GovukTextAreaComponent } from '@components/govuk/govuk-text-area/govuk-text-area.component';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT as PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT } from '../constants/controls/fines-mac-payment-terms-controls-hold-enforcement-on-account.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF as PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF } from '../constants/controls/fines-mac-payment-terms-controls-hold-enforcement-reason.constant';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { ISessionUserStateRole } from '@services/session-service/interfaces/session-user-state.interface';
import { FinesMacPaymentTermsPermissions } from '../enums/fines-mac-payment-terms-permissions.enum';
import { IFinesMacPaymentTermsPermissions } from '../interfaces/fines-mac-payment-terms-permissions.interface';

@Component({
  selector: 'app-fines-mac-payment-terms-form',
  standalone: true,
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
  @Input() public defendantType!: string;
  @Output() protected override formSubmit = new EventEmitter<IFinesMacPaymentTermsForm>();

  protected readonly finesService = inject(FinesService);
  protected readonly dateService = inject(DateService);
  protected readonly fineMacRoutingPaths = FINES_MAC_ROUTING_PATHS;
  private readonly hasPermissionAccess = inject(PermissionsService).hasPermissionAccess;
  private readonly userStateRoles: ISessionUserStateRole[] = this.globalStateService.userState()?.roles || [];

  public readonly permissionsMap = FinesMacPaymentTermsPermissions;
  public readonly permissions: IFinesMacPaymentTermsPermissions = {
    [FinesMacPaymentTermsPermissions.collectionOrder]: false,
  };

  override fieldErrors: IFinesMacPaymentTermsFieldErrors = {
    ...FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS,
  };

  protected readonly defendantTypes = FINES_MAC_DEFENDANT_TYPES;
  public readonly paymentTermOptions = FINES_MAC_PAYMENT_TERMS_OPTIONS;
  public readonly paymentTerms: IGovUkRadioOptions[] = Object.entries(this.paymentTermOptions).map(([key, value]) => ({
    key,
    value,
  }));
  public readonly frequencyOptions: IGovUkRadioOptions[] = Object.entries(
    FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS,
  ).map(([key, value]) => ({ key, value }));
  public readonly paymentTermsControls: IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation =
    FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION;
  public yesterday!: string;
  public today!: string;
  public isAdult!: boolean;
  public dateInFuture!: boolean;
  public dateInPast!: boolean;
  public accessDefaultDates!: boolean;
  public accessCollectionOrder!: boolean;

  public ptHasCollectionOrderControl = PT_CONTROL_HAS_COLLECTION_ORDER;
  public ptCollectionOrderDateControl = PT_CONTROL_COLLECTION_ORDER_DATE;
  public ptMakeCollectionOrderTodayControl = PT_CONTROL_MAKE_COLLECTION_ORDER_TODAY;
  public ptPaymentTermsControl = PT_CONTROL_PAYMENT_TERMS;
  public ptPayByDateControl = PT_CONTROL_PAY_BY_DATE;
  public ptLumpSumControl = PT_CONTROL_LUMP_SUM;
  public ptInstalmentControl = PT_CONTROL_INSTALMENT;
  public ptFrequencyControl = PT_CONTROL_FREQUENCY;
  public ptStartDateControl = PT_CONTROL_START_DATE;
  public ptRequestCardPaymentControl = PT_CONTROL_REQUEST_CARD_PAYMENT;
  public ptHasDaysInDefaultControl = PT_CONTROL_HAS_DAYS_IN_DEFAULT;
  public ptDaysInDefaultControl = PT_CONTROL_DAYS_IN_DEFAULT;
  public ptDaysInDefaultDateControl = PT_CONTROL_DAYS_IN_DEFAULT_DATE;
  public ptAddEnforcementActionControl = PT_CONTROL_ADD_ENFORCEMENT_ACTION;

  /**
   * Sets up the payment terms form.
   */
  private setupPaymentTermsForm(): void {
    this.form = new FormGroup({
      [this.ptPaymentTermsControl.controlName]: this.createFormControl(this.ptPaymentTermsControl.validators),
      [this.ptRequestCardPaymentControl.controlName]: this.createFormControl(
        this.ptRequestCardPaymentControl.validators,
      ),
      [this.ptHasDaysInDefaultControl.controlName]: this.createFormControl(this.ptHasDaysInDefaultControl.validators),
    });
  }

  /**
   * Sets up the permissions for the fines-mac-payment-terms-form component.
   * It checks if the user has permission access for the collection order based on the business unit ID and user roles.
   */
  private setupPermissions(): void {
    const { business_unit_id: businessUnitId } = this.finesService.finesMacState.businessUnit;
    if (this.userStateRoles && this.userStateRoles.length > 0) {
      this.permissions[this.permissionsMap.collectionOrder] = this.hasPermissionAccess(
        this.permissionsMap.collectionOrder,
        businessUnitId,
        this.userStateRoles,
      );
    }
  }

  /**
   * Sets up the initial payment terms for the fines-mac-payment-terms-form component.
   * This method performs the following tasks:
   * - Sets up permissions.
   * - Sets up the payment terms form.
   * - Checks if the user can access default dates.
   * - Adds collection order form controls if the user has access to collection order.
   * - Listens for changes in the number of days in default.
   * - Listens for changes in the payment terms.
   * - Sets initial error messages.
   * - Repopulates the form with the provided form data.
   * - Sets the 'yesterday' variable to the previous date.
   * - Sets the 'today' variable to the current date.
   */
  private initialPaymentTermsSetup(): void {
    const { formData } = this.finesService.finesMacState.paymentTerms;
    this.setupPermissions();
    this.setupPaymentTermsForm();
    this.createEnforcementFields();
    this.canAccessDefaultDates();
    if (this.accessCollectionOrder) {
      this.addCollectionOrderFormControls();
    }
    this.hasDaysInDefaultListener();
    this.paymentTermsListener();
    this.setInitialErrorMessages();
    this.rePopulateForm(formData);
    this.yesterday = this.dateService.getPreviousDate({ days: 1 });
    this.today = this.dateService.toFormat(this.dateService.getDateNow(), 'dd/MM/yyyy');
  }

  /**
   * Adds the collection order form controls to the component.
   * This method creates the necessary form controls and sets up the listener for changes.
   */
  private addCollectionOrderFormControls(): void {
    this.createControl(this.ptHasCollectionOrderControl.controlName, this.ptHasCollectionOrderControl.validators);
    this.hasCollectionOrderListener();
  }

  /**
   * Listens for changes in the hasCollectionOrder control and updates the form accordingly.
   * If the value is 'yes', it creates the ptCollectionOrderDate control and removes the ptMakeCollectionOrderToday control.
   * If the value is not 'yes', it removes the ptCollectionOrderDate control and creates the ptMakeCollectionOrderToday control.
   */
  private hasCollectionOrderListener(): void {
    const { [this.ptHasCollectionOrderControl.controlName]: hasCollectionOrder } = this.form.controls;

    hasCollectionOrder.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (hasCollectionOrder.value === 'yes') {
        this.form.get(this.ptCollectionOrderDateControl.controlName)?.reset();
        this.createControl(this.ptCollectionOrderDateControl.controlName, this.ptCollectionOrderDateControl.validators);
        this.removeControl(this.ptMakeCollectionOrderTodayControl.controlName);
      } else {
        this.removeControl(this.ptCollectionOrderDateControl.controlName);
        this.createControl(
          this.ptMakeCollectionOrderTodayControl.controlName,
          this.ptMakeCollectionOrderTodayControl.validators,
        );
        this.createControl(this.ptCollectionOrderDateControl.controlName, []);
      }
    });
  }

  /**
   * Listens for changes in the 'hasDaysInDefault' form control and performs actions accordingly.
   * If the value of 'hasDaysInDefault' is true, it creates the necessary form controls.
   * If the value of 'hasDaysInDefault' is false, it removes the unnecessary form controls.
   */
  private hasDaysInDefaultListener(): void {
    const { [this.ptHasDaysInDefaultControl.controlName]: hasDaysInDefault } = this.form.controls;

    hasDaysInDefault.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (hasDaysInDefault.value === true) {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.forEach((control) => {
          this.createControl(control.controlName, control.validators);
        });
      } else {
        FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION.forEach((control) => {
          this.removeControl(control.controlName);
        });
      }
    });
  }

  /**
   * Listens for changes in the payment terms control and performs necessary actions based on the selected term.
   * @private
   * @returns {void}
   */
  private handleControl(
    control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation,
    action: 'add' | 'remove',
  ): void {
    if (action === 'remove') {
      this.removeControl(control.controlName);
      this.removeControlErrors(control.controlName);
      this.resetDateChecker();
    } else if (action === 'add') {
      this.createControl(control.controlName, control.validators);
      if (
        control.controlName === this.ptStartDateControl.controlName ||
        control.controlName === this.ptPayByDateControl.controlName
      ) {
        this.dateListener(control.controlName);
      }
    }
  }

  /**
   * Listens for changes in the payment terms control and performs actions based on the selected term.
   */
  private paymentTermsListener(): void {
    const { payment_terms: paymentTerms } = this.form.controls;

    paymentTerms.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe((selectedTerm) => {
      const controls =
        this.paymentTermsControls[selectedTerm as keyof IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation];

      if (!controls) {
        return;
      }

      controls.fieldsToRemove?.forEach((control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation) => {
        this.handleControl(control, 'remove');
      });

      controls.fieldsToAdd?.forEach((control: IFinesMacPaymentTermsPaymentTermOptionsControlValidation) => {
        this.handleControl(control, 'add');
      });
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
   * Resets the date checker flags to their initial state.
   */
  private resetDateChecker(): void {
    this.dateInFuture = false;
    this.dateInPast = false;
  }

  /**
   * Determines whether the user can access default dates based on the defendant type.
   */
  private canAccessDefaultDates(): void {
    let formData;
    switch (this.defendantTypes[this.defendantType as keyof IFinesMacDefendantTypes]) {
      case this.defendantTypes.adultOrYouthOnly:
        formData = this.finesService.finesMacState.personalDetails.formData;
        this.accessDefaultDates = !formData.dob || this.dateService.calculateAge(formData.dob) >= 18;
        this.accessCollectionOrder = !formData.dob || this.dateService.calculateAge(formData.dob) >= 18;
        break;
      case this.defendantTypes.parentOrGuardianToPay:
        this.accessDefaultDates = true;
        this.accessCollectionOrder = true;
        break;
      default:
        this.accessDefaultDates = false;
    }
  }

  /**
   * Listens to changes in the hold_enforcement_on_account form control and performs actions accordingly.
   */
  private holdEnforcementOnAccountListener(): void {
    const { hold_enforcement_on_account: holdEnforcementOnAccount } = this.form.controls;

    holdEnforcementOnAccount.valueChanges.pipe(takeUntil(this['ngUnsubscribe'])).subscribe(() => {
      if (holdEnforcementOnAccount.value === true) {
        this.createControl(
          PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF.controlName,
          PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF.validators,
        );
      } else {
        this.removeControl(PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF.controlName);
      }
    });
  }

  /**
   * Creates enforcement fields based on the defendant type.
   * If the defendant type is a company, it creates the control for holding enforcement on account.
   * Otherwise, it creates the control for adding enforcement action.
   */
  private createEnforcementFields(): void {
    if (this.defendantTypes[this.defendantType as keyof IFinesMacDefendantTypes] === this.defendantTypes.company) {
      this.createControl(
        PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT.controlName,
        PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT.validators,
      );
      this.holdEnforcementOnAccountListener();
    } else {
      this.createControl(PT_CONTROL_ADD_ENFORCEMENT_ACTION.controlName, PT_CONTROL_ADD_ENFORCEMENT_ACTION.validators);
    }
  }

  /**
   * Sets the collection order date based on the value of makeCollectionOrderToday.
   * If makeCollectionOrderToday is true, the collection order date is set to today's date.
   */
  private setCollectionOrderDate(): void {
    const makeCollectionOrderToday = this.form.get(this.ptMakeCollectionOrderTodayControl.controlName)?.value;
    if (makeCollectionOrderToday === true) {
      this.form.get(this.ptCollectionOrderDateControl.controlName)?.setValue(this.today);
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
