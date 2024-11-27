import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GovukSummaryCardListComponent } from '@components/govuk/govuk-summary-card-list/govuk-summary-card-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { IFinesMacPaymentTermsState } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { FINES_MAC_PAYMENT_TERMS_OPTIONS } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-options';
import { IFinesMacPaymentTermsOptions } from '../../fines-mac-payment-terms/interfaces/fines-may-payment-terms-options.interface';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-enforcement-action-options';
import { IFinesMacPaymentTermsEnforcementActionsOptions } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-enforcement-actions-options.interface';
import { FinesMacReviewAccountDefaultValues } from '../enums/fines-mac-review-account-default-values.enum';
import { FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../../fines-mac-payment-terms/constants/fines-mac-payment-terms-frequency-options';
import { IFinesMacPaymentTermsFrequencyOptions } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-frequency-options.interface';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { ISessionUserStateRole } from '@services/session-service/interfaces/session-user-state.interface';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { FinesMacPaymentTermsPermissions } from '../../fines-mac-payment-terms/enums/fines-mac-payment-terms-permissions.enum';
import { IFinesMacPaymentTermsPermissions } from '../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-permissions.interface';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { CommonModule } from '@angular/common';
import { FinesMacReviewAccountChangeLinkComponent } from '../fines-mac-review-account-change-link/fines-mac-review-account-change-link.component';

@Component({
  selector: 'app-fines-mac-review-account-payment-terms',
  standalone: true,
  imports: [
    CommonModule,
    GovukSummaryCardListComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesMacReviewAccountChangeLinkComponent,
  ],
  templateUrl: './fines-mac-review-account-payment-terms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacReviewAccountPaymentTermsComponent implements OnInit {
  @Input({ required: true }) public paymentTermsState!: IFinesMacPaymentTermsState;
  @Input({ required: true }) public businessUnit!: IOpalFinesBusinessUnit;
  @Output() public emitChangePaymentTerms = new EventEmitter<void>();

  private readonly globalStateService = inject(GlobalStateService);
  private readonly dateService = inject(DateService);
  private readonly hasPermissionAccess = inject(PermissionsService).hasPermissionAccess;
  private readonly userStateRoles: ISessionUserStateRole[] =
    this.globalStateService.userState()?.business_unit_user || [];

  public readonly permissionsMap = FinesMacPaymentTermsPermissions;
  public readonly permissions: IFinesMacPaymentTermsPermissions = {
    [FinesMacPaymentTermsPermissions.collectionOrder]: false,
  };

  public readonly defaultValues = FinesMacReviewAccountDefaultValues;
  protected readonly paymentTermsOptions = FINES_MAC_PAYMENT_TERMS_OPTIONS;
  protected readonly enforcementActions = FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS;
  private readonly frequencyOptions = FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS;

  public paymentTerms!: string;
  public payByDate!: string;
  public daysInDefaultDate!: string;
  public enforcementAction!: string;
  public earliestReleaseDate!: string;
  public frequency!: string;
  public startDate!: string;
  public collectionOrderDate!: string;

  /**
   * Sets up permissions for the component based on the user's state roles and business unit.
   *
   * This method extracts the business unit ID from the `businessUnit` object and checks if the
   * user has any state roles. If state roles are present, it assigns the appropriate permissions
   * for the `collectionOrder` based on the user's access rights.
   *
   * @private
   */
  private setupPermissions(): void {
    const { business_unit_id: businessUnitId } = this.businessUnit;
    if (this.userStateRoles && this.userStateRoles.length > 0) {
      this.permissions[this.permissionsMap.collectionOrder] = this.hasPermissionAccess(
        this.permissionsMap.collectionOrder,
        businessUnitId,
        this.userStateRoles,
      );
    }
  }

  /**
   * Retrieves the payment terms based on the current payment terms state.
   * The payment terms are selected from the paymentTermsOptions using the
   * fm_payment_terms_payment_terms property of the paymentTermsState.
   * The selected payment terms are then assigned to the paymentTerms property.
   *
   * @private
   */
  private getPaymentTerms(): void {
    this.paymentTerms =
      this.paymentTermsOptions[
        this.paymentTermsState.fm_payment_terms_payment_terms! as keyof IFinesMacPaymentTermsOptions
      ];
  }

  /**
   * Retrieves and formats the payment terms "pay by" date.
   *
   * This method checks if the `fm_payment_terms_pay_by_date` property exists in the `paymentTermsState`.
   * If it does, it converts the date from the format 'dd/MM/yyyy' to a Date object,
   * and then formats it to 'dd MMMM yyyy', storing the result in the `payByDate` property.
   *
   * @private
   * @returns {void}
   */
  private getPayByDate(): void {
    if (this.paymentTermsState.fm_payment_terms_pay_by_date) {
      const payByDate = this.dateService.getFromFormat(
        this.paymentTermsState.fm_payment_terms_pay_by_date,
        'dd/MM/yyyy',
      );
      this.payByDate = this.dateService.toFormat(payByDate, 'dd MMMM yyyy');
    }
  }

  /**
   * Calculates and formats the number of days in default date based on the suspended committal date
   * from the payment terms state. If the suspended committal date is available, it converts the date
   * from the specified format ('dd/MM/yyyy') to another format ('dd MMMM yyyy') and assigns it to
   * `daysInDefaultDate`.
   *
   * @private
   * @returns {void}
   */
  private getDaysInDefaultDate(): void {
    if (this.paymentTermsState.fm_payment_terms_suspended_committal_date) {
      const daysInDefaultDate = this.dateService.getFromFormat(
        this.paymentTermsState.fm_payment_terms_suspended_committal_date,
        'dd/MM/yyyy',
      );
      this.daysInDefaultDate = this.dateService.toFormat(daysInDefaultDate, 'dd MMMM yyyy');
    }
  }

  /**
   * Retrieves the enforcement action based on the current payment terms state.
   * The enforcement action is determined by accessing the `enforcementActions` object
   * using the `fm_payment_terms_enforcement_action` property from the `paymentTermsState`.
   * The result is stored in the `enforcementAction` property.
   *
   * @private
   */
  private getEnforcementAction(): void {
    this.enforcementAction =
      this.enforcementActions[
        this.paymentTermsState
          .fm_payment_terms_enforcement_action! as keyof IFinesMacPaymentTermsEnforcementActionsOptions
      ];
  }

  /**
   * Retrieves the earliest release date from the payment terms state, formats it,
   * and assigns it to the `earliestReleaseDate` property.
   *
   * If `fm_payment_terms_earliest_release_date` is present in the `paymentTermsState`,
   * it converts the date from 'dd/MM/yyyy' format to a Date object, then formats it
   * to 'dd MMMM yyyy' and assigns it to `earliestReleaseDate`.
   *
   * @private
   * @returns {void}
   */
  private getEarliestReleaseDate(): void {
    if (this.paymentTermsState.fm_payment_terms_earliest_release_date) {
      const earliestReleaseDate = this.dateService.getFromFormat(
        this.paymentTermsState.fm_payment_terms_earliest_release_date,
        'dd/MM/yyyy',
      );
      this.earliestReleaseDate = this.dateService.toFormat(earliestReleaseDate, 'dd MMMM yyyy');
    }
  }

  /**
   * Retrieves the frequency value from the frequency options based on the payment terms instalment period
   * and assigns it to the `frequency` property.
   *
   * @private
   */
  private getFrequency(): void {
    this.frequency =
      this.frequencyOptions[
        this.paymentTermsState.fm_payment_terms_instalment_period! as keyof IFinesMacPaymentTermsFrequencyOptions
      ];
  }

  /**
   * Retrieves and formats the start date from the payment terms state.
   * If the `fm_payment_terms_start_date` is present in the `paymentTermsState`,
   * it converts the date from the format 'dd/MM/yyyy' to 'dd MMMM yyyy' and assigns it to `startDate`.
   *
   * @private
   * @returns {void}
   */
  private getStartDate(): void {
    if (this.paymentTermsState.fm_payment_terms_start_date) {
      const startDate = this.dateService.getFromFormat(
        this.paymentTermsState.fm_payment_terms_start_date,
        'dd/MM/yyyy',
      );
      this.startDate = this.dateService.toFormat(startDate, 'dd MMMM yyyy');
    }
  }

  /**
   * Retrieves and formats the collection order date from the payment terms state.
   * If the `fm_payment_terms_collection_order_date` is present in the `paymentTermsState`,
   * it converts the date from 'dd/MM/yyyy' format to a `Date` object and then formats it
   * to 'dd MMMM yyyy' format, storing the result in `collectionOrderDate`.
   *
   * @private
   * @returns {void}
   */
  private getCollectionOrderDate(): void {
    if (this.paymentTermsState.fm_payment_terms_collection_order_date) {
      const collectionOrderDate = this.dateService.getFromFormat(
        this.paymentTermsState.fm_payment_terms_collection_order_date,
        'dd/MM/yyyy',
      );
      this.collectionOrderDate = this.dateService.toFormat(collectionOrderDate, 'dd MMMM yyyy');
    }
  }

  /**
   * Retrieves and sets up various payment terms data.
   * This method initializes permissions and fetches multiple
   * payment-related dates and actions, including:
   * - Payment terms
   * - Pay-by date
   * - Days in default date
   * - Enforcement action
   * - Earliest release date
   * - Frequency
   * - Start date
   * - Collection order date
   *
   * @private
   */
  private getPaymentTermsData(): void {
    this.setupPermissions();
    this.getPaymentTerms();
    this.getPayByDate();
    this.getDaysInDefaultDate();
    this.getEnforcementAction();
    this.getEarliestReleaseDate();
    this.getFrequency();
    this.getStartDate();
    this.getCollectionOrderDate();
  }

  /**
   * Emits an event to indicate that payment terms needs changed.
   * This method triggers the `emitChangePaymentTerms` event emitter.
   */
  public changePaymentTerms(): void {
    this.emitChangePaymentTerms.emit();
  }

  public ngOnInit(): void {
    this.getPaymentTermsData();
  }
}