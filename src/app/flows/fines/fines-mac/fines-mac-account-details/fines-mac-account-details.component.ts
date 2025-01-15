import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IFinesMacAccountDetailsAccountStatus } from './interfaces/fines-mac-account-details-account-status.interface';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS } from './constants/fines-mac-account-details-account-status';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES } from './constants/fines-mac-account-details-account-types';
import { FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES } from './constants/fines-mac-account-details-defendant-types';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { GovukButtonComponent } from '@components/govuk/govuk-button/govuk-button.component';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukTagComponent } from '@components/govuk/govuk-tag/govuk-tag.component';
import { GovukTaskListComponent } from '@components/govuk/govuk-task-list/govuk-task-list.component';
import { GovukTaskListItemComponent } from '@components/govuk/govuk-task-list/govuk-task-list-item/govuk-task-list-item.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';
import { Subject, takeUntil } from 'rxjs';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { IFinesMacAccountTypes } from '../interfaces/fines-mac-account-types.interface';
import { IFinesMacDefendantTypes } from '../interfaces/fines-mac-defendant-types.interface';
import { IOpalFinesBusinessUnitNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from '../../fines-draft/fines-draft-cam/routing/constants/fines-draft-cam-routing-paths.constant';
import { MojTimelineComponent } from '../../../../components/moj/moj-timeline/moj-timeline.component';
import { MojTimelineItemComponent } from '../../../../components/moj/moj-timeline/moj-timeline-item/moj-timeline-item.component';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { IOpalFinesOffencesNonSnakeCase } from '@services/fines/opal-fines-service/interfaces/opal-fines-offences-ref-data.interface';
import { IDraftAccountResolver } from '../routing/resolvers/draft-account-resolver/interfaces/draft-account-resolver.interface';
import { IFinesMacAddAccountPayload } from '../services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { FinesMacBaseComponent } from '../components/abstract/fines-mac-base.component';
import { TransformationService } from '@services/transformation-service/transformation.service';

@Component({
  selector: 'app-fines-mac-account-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukTagComponent,
    GovukTaskListComponent,
    GovukTaskListItemComponent,
    GovukButtonComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukBackLinkComponent,
    MojTimelineComponent,
    MojTimelineItemComponent,
  ],
  templateUrl: './fines-mac-account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountDetailsComponent extends FinesMacBaseComponent<FinesService> implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesService = inject(FinesService);
  protected readonly utilsService = inject(UtilsService);
  protected readonly dateService = inject(DateService);
  private readonly finesMacPayloadService = inject(FinesMacPayloadService);
  private readonly transformationService = inject(TransformationService);

  public accountCreationStatus: IFinesMacAccountDetailsAccountStatus = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  protected readonly defendantTypes = FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES;
  private readonly accountTypes = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES;
  protected readonly languageOptions = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public defendantType!: string;
  public accountType!: string;
  public documentLanguage!: string;
  public courtHearingLanguage!: string;
  public paymentTermsBypassDefendantTypes = [this.defendantTypes.company, this.defendantTypes.parentOrGuardianToPay];
  public pageNavigation!: boolean;
  public mandatorySectionsCompleted!: boolean;
  public readonly finesMacStatus = FINES_MAC_STATUS;

  protected readonly finesRoutes = FINES_ROUTING_PATHS;
  protected readonly fineMacRoutes = FINES_MAC_ROUTING_PATHS;
  protected readonly finesDraftRoutes = FINES_DRAFT_CAM_ROUTING_PATHS;

  private draftAccountFinesMacState!: IDraftAccountResolver | null;
  public status = FINES_DRAFT_TAB_STATUSES.find(
    (status) =>
      this.finesService.finesDraftState.account_status &&
      status.statuses.includes(this.finesService.finesDraftState.account_status),
  )?.prettyName;

  /**
   * Determines whether the component can be deactivated.
   * @returns A CanDeactivateTypes object representing the navigation status.
   */
  canDeactivate(): CanDeactivateTypes {
    return this.pageNavigation;
  }

  /**
   * Updates the state of the fines service with the provided draft account payload.
   *
   * This method updates two different states within the fines service:
   * 1. The `finesDraftState` with the provided `draftAccount`.
   * 2. The `finesMacState` with the mapped account payload derived from the `draftAccount`.
   *
   * @param draftAccount - The payload containing the draft account details to update the fines service state.
   * @returns void
   */
  private updateFinesServiceState(draftAccount: IFinesMacAddAccountPayload): void {
    this.updateServiceState(this.finesService, draftAccount, 'finesDraftState');
    this.updateServiceState(
      this.finesService,
      this.finesMacPayloadService.mapAccountPayload(draftAccount),
      'finesMacState',
    );
  }

  /**
   * Retrieves the draft account status and maps it to the corresponding status.
   * The status is obtained from the fines service and mapped using the provided
   * draft state and status mapping.
   *
   * @private
   * @returns {void}
   */
  private getDraftAccountStatus(): void {
    this.status = this.getMappedStatus(this.finesService, 'finesDraftState.account_status', FINES_DRAFT_TAB_STATUSES);
  }

  /**
   * Maps the business unit details from camelCase to snake_case and updates the fines service state.
   *
   * @param businessUnit - The business unit details in camelCase format.
   * @remarks
   * This method transforms the business unit details from camelCase to snake_case
   * due to the `getBusinessUnitById` method returning data in camelCase. This is a temporary
   * solution and should be refactored once the endpoint returns data in the correct format.
   */
  private mapBusinessUnitDetails(businessUnit: IOpalFinesBusinessUnitNonSnakeCase): void {
    // Due to getBusinessUnitById being camelCase, we need to map the snake_case to camelCase
    // Refactor once endpoint fixed
    const businessUnitSnakeCase = this.transformationService.transformCamelToSnakeCase(businessUnit);
    this.updateNestedServiceState(this.finesService, businessUnitSnakeCase, 'finesMacState.businessUnit');
  }

  /**
   * Maps offence details from the provided offences data to the fines service state.
   *
   * This method updates the `fm_offence_details_offence_cjs_code` property of each offence
   * in the `finesMacState.offenceDetails` array by finding the corresponding offence in the
   * provided `offencesData` array based on the `offenceId`.
   *
   * @param offencesData - An array of offence data objects in non-snake case format.
   *
   * @remarks
   * This method is a temporary solution due to the `getOffencesById` method returning data
   * in camelCase. It should be refactored once the endpoint is fixed to return data in the
   * expected format.
   */
  private mapOffenceDetails(offencesData: IOpalFinesOffencesNonSnakeCase[]): void {
    // Due to getOffencesById being camelCase, we need to map the snake_case to camelCase
    // Refactor once endpoint fixed
    const offenceDataSnakeCase = this.transformationService.transformCamelToSnakeCase(offencesData);
    this.mapArrayData(
      this.finesService,
      offenceDataSnakeCase,
      'finesMacState.offenceDetails',
      'formData.fm_offence_details_offence_id',
      'offence_id',
      [{ sourceKey: 'cjs_code', targetKey: 'formData.fm_offence_details_offence_cjs_code' }],
    );
  }

  /**
   * Retrieves the draft account fines MAC state from the activated route snapshot.
   * If the state is available, it updates the fines service state, maps the business unit details,
   * maps the offence details, and sets the component to read-only mode.
   *
   * @private
   * @returns {void}
   */
  private getDraftAccountFinesMacState(): void {
    if (this.activatedRoute.snapshot) {
      this.draftAccountFinesMacState = this.activatedRoute.snapshot.data['draftAccountFinesMacState'];
      if (this.draftAccountFinesMacState) {
        const { draftAccount, businessUnit, offencesData } = this.draftAccountFinesMacState;
        this.updateFinesServiceState(draftAccount);
        this.getDraftAccountStatus();
        this.mapBusinessUnitDetails(businessUnit);
        this.mapOffenceDetails(offencesData);
      }
    }
  }
  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { fm_create_account_defendant_type: defendantType } = this.finesService.finesMacState.accountDetails.formData;
    this.defendantType = this.defendantTypes[defendantType as keyof IFinesMacDefendantTypes] || '';
  }

  /**
   * Sets the account type based on the value in the `finesMacState.accountDetails` object.
   * If the `AccountType` property is defined, it maps the value to the corresponding account type
   * from the `accountTypes` array and assigns it to the `accountType` property.
   */
  private setAccountType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { fm_create_account_account_type: accountType } = this.finesService.finesMacState.accountDetails.formData;
    this.accountType = this.accountTypes[accountType as keyof IFinesMacAccountTypes] || '';
  }

  /**
   * Sets the document language and court hearing language based on the language preferences
   * stored in the finesMacState.
   */
  private setLanguage(): void {
    const {
      fm_language_preferences_document_language: documentLanguage,
      fm_language_preferences_hearing_language: hearingLanguage,
    } = this.finesService.finesMacState.languagePreferences.formData;
    if (documentLanguage && hearingLanguage) {
      this.documentLanguage = this.languageOptions[documentLanguage as keyof IFinesMacLanguagePreferencesOptions] || '';
      this.courtHearingLanguage =
        this.languageOptions[hearingLanguage as keyof IFinesMacLanguagePreferencesOptions] || '';
    }
  }

  /**
   * Listens to router events and updates the `pageNavigation` property accordingly.
   */
  private routerListener(): void {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.pageNavigation = !event.url.includes(this.fineMacRoutes.children.createAccount);
      }
    });
  }

  /**
   * Checks if all mandatory sections are completed by calling the finesService.
   * Updates the `mandatorySectionsCompleted` property with the result.
   *
   * @private
   * @returns {void}
   */
  private checkMandatorySections(): void {
    this.mandatorySectionsCompleted = this.finesService.checkMandatorySections();
  }

  /**
   * Performs the initial setup for the fines-mac-account-details component.
   * Sets the defendant type and account type.
   */
  private initialAccountDetailsSetup(): void {
    this.getDraftAccountFinesMacState();
    this.setDefendantType();
    this.setAccountType();
    this.setLanguage();
    this.checkMandatorySections();
    this.routerListener();
  }

  /**
   * Determines whether the user can access the payment terms.
   * The user can access the payment terms if either the personal details have been provided
   * or the defendant type is included in the payment terms bypass defendant types.
   *
   * @returns A boolean value indicating whether the user can access the payment terms.
   */
  protected canAccessPaymentTerms(): boolean {
    return (
      this.finesService.finesMacState.personalDetails.status === FINES_MAC_STATUS.PROVIDED ||
      this.paymentTermsBypassDefendantTypes.includes(this.defendantType)
    );
  }

  /**
   * Navigates back to the previous page
   * Page navigation set to false to trigger the canDeactivate guard
   */
  public navigateBack(): void {
    if (this.finesService.finesDraftAmend()) {
      this.handleRoute(
        `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.inputter}`,
        false,
        undefined,
        this.finesService.finesDraftFragment(),
      );
    } else {
      this.pageNavigation = false;
      this.handleRoute(this.fineMacRoutes.children.createAccount);
    }
  }

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event, fragment?: string): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([route]);
    } else if (fragment) {
      this.router.navigate([route], { fragment });
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  public ngOnInit(): void {
    this.initialAccountDetailsSetup();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
