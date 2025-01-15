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
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_DRAFT_CAM_ROUTING_PATHS } from '../../fines-draft/fines-draft-cam/routing/constants/fines-draft-cam-routing-paths.constant';
import { MojTimelineComponent } from '../../../../components/moj/moj-timeline/moj-timeline.component';
import { MojTimelineItemComponent } from '../../../../components/moj/moj-timeline/moj-timeline-item/moj-timeline-item.component';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { IDraftAccountResolver } from '../routing/resolvers/draft-account-resolver/interfaces/draft-account-resolver.interface';
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
   * Retrieves the draft account fines MAC state for amending and updates the service state accordingly.
   *
   * This method performs the following actions:
   * 1. Checks if the `activatedRoute.snapshot` is available.
   * 2. Retrieves the `draftAccountFinesMacState` from the route snapshot data.
   * 3. If `draftAccountFinesMacState` is available, extracts `draftAccount`, `businessUnit`, and `offencesData`.
   * 4. Updates the fines service state with the draft account payload for amendments.
   * 5. Extracts and sets the account status from the payload to display at the top of the screen.
   * 6. Transforms and updates the business unit data from snake_case to camelCase.
   * 7. Transforms and maps the offence data from snake_case to camelCase.
   *
   * @private
   * @returns {void}
   */
  private getDraftAccountFinesMacStateForAmending(): void {
    if (this.activatedRoute.snapshot) {
      this.draftAccountFinesMacState = this.activatedRoute.snapshot.data['draftAccountFinesMacState'];
      if (this.draftAccountFinesMacState) {
        const { draftAccount, businessUnit, offencesData } = this.draftAccountFinesMacState;

        // Populate the Fines Mac State with the draft account payload for amendments
        this.updateServiceState(this.finesService, draftAccount, 'finesDraftState');
        this.updateServiceState(
          this.finesService,
          this.finesMacPayloadService.mapAccountPayload(draftAccount),
          'finesMacState',
        );

        // Extract the account status from the payload to display at the top of the screen
        this.status = this.getMappedStatus(
          this.finesService,
          'finesDraftState.account_status',
          FINES_DRAFT_TAB_STATUSES,
        );

        // Map snake_case business unit data to camelCase to align with service expectations
        // To be updated once the endpoint provides camelCase data directly
        const businessUnitSnakeCase = this.transformationService.transformCamelToSnakeCase(businessUnit);
        this.updateNestedServiceState(this.finesService, businessUnitSnakeCase, 'finesMacState.businessUnit');

        // Map snake_case offence data to camelCase to align with service expectations
        // To be updated once the endpoint provides camelCase data directly
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
    this.getDraftAccountFinesMacStateForAmending();
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
