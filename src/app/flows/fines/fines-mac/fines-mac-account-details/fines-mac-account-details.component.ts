import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IFinesMacAccountDetailsAccountStatus } from './interfaces/fines-mac-account-details-account-status.interface';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS } from './constants/fines-mac-account-details-account-status';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES } from './constants/fines-mac-account-details-account-types';
import { FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES } from './constants/fines-mac-account-details-defendant-types';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { GovukTagComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-tag';
import {
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-task-list';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { IFinesMacAccountTypes } from '../interfaces/fines-mac-account-types.interface';
import { IFinesMacDefendantTypes } from '../interfaces/fines-mac-defendant-types.interface';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_DRAFT_TAB_STATUSES } from '../../fines-draft/constants/fines-draft-tab-statuses.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IFetchMapFinesMacPayload } from '../routing/resolvers/fetch-map-fines-mac-payload-resolver/interfaces/fetch-map-fines-mac-payload.interface';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { FinesMacReviewAccountHistoryComponent } from '../fines-mac-review-account/fines-mac-review-account-history/fines-mac-review-account-history.component';
import { FINES_DRAFT_ROUTING_PATHS } from '../../fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS } from '../../fines-draft/fines-draft-check-and-manage/routing/constants/fines-draft-check-and-manage-routing-paths.constant';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';

@Component({
  selector: 'app-fines-mac-account-details',
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
    FinesMacReviewAccountHistoryComponent,
  ],
  templateUrl: './fines-mac-account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountDetailsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesMacStore = inject(FinesMacStore);
  protected readonly finesDraftStore = inject(FinesDraftStore);
  protected readonly utilsService = inject(UtilsService);
  protected readonly dateService = inject(DateService);

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
  protected readonly finesDraftRoutes = FINES_DRAFT_ROUTING_PATHS;
  protected readonly finesDraftCheckAndManageRoutes = FINES_DRAFT_CHECK_AND_MANAGE_ROUTING_PATHS;

  public accountDetailsStatus!: string;

  /**
   * Determines whether the component can be deactivated.
   * @returns A CanDeactivateTypes object representing the navigation status.
   */
  canDeactivate(): CanDeactivateTypes {
    return this.pageNavigation;
  }

  /**
   * Sets the account details status from the fines service state.
   *
   * @private
   * @returns {void}
   */
  private setAccountDetailsStatus(): void {
    const accountStatus = this.finesDraftStore.account_status();
    if (!accountStatus) return;

    this.accountDetailsStatus =
      FINES_DRAFT_TAB_STATUSES.find((status) => status.statuses.includes(accountStatus))?.prettyName ?? '';
  }

  /**
   * Fetches and maps account details payload from the activated route snapshot.
   *
   * This method retrieves the `accountDetailsFetchMap` from the route snapshot data,
   * and updates the `finesMacState` and `finesDraftState` in the `finesService` with the fetched data.
   * It also sets the account details status based on the fetched payload.
   *
   * @private
   * @returns {void}
   */
  private accountDetailsFetchedMappedPayload(): void {
    const snapshot = this.activatedRoute.snapshot;
    if (!snapshot) return;

    const accountDetailsFetchMap = snapshot.data['accountDetailsFetchMap'] as IFetchMapFinesMacPayload;
    if (!accountDetailsFetchMap) return;

    // Get payload into Fines Mac State
    this.finesMacStore.setFinesMacStore(accountDetailsFetchMap.finesMacState);
    this.finesDraftStore.setFinesDraftState(accountDetailsFetchMap.finesMacDraft);

    // Grab the status from the payload
    this.setAccountDetailsStatus();
  }

  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { fm_create_account_defendant_type: defendantType } = this.finesMacStore.accountDetails().formData;
    this.defendantType = this.defendantTypes[defendantType as keyof IFinesMacDefendantTypes] || '';
  }

  /**
   * Sets the account type based on the value in the `finesMacStore.accountDetails` object.
   * If the `AccountType` property is defined, it maps the value to the corresponding account type
   * from the `accountTypes` array and assigns it to the `accountType` property.
   */
  private setAccountType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { fm_create_account_account_type: accountType } = this.finesMacStore.accountDetails().formData;
    this.accountType = this.accountTypes[accountType as keyof IFinesMacAccountTypes] || '';
  }

  /**
   * Sets the document language and court hearing language based on the language preferences
   * stored in the finesMacStore.
   */
  private setLanguage(): void {
    const {
      fm_language_preferences_document_language: documentLanguage,
      fm_language_preferences_hearing_language: hearingLanguage,
    } = this.finesMacStore.languagePreferences().formData;
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
    this.mandatorySectionsCompleted = false;
    switch (this.finesMacStore.getDefendantType()) {
      case 'adultOrYouthOnly':
        this.mandatorySectionsCompleted = this.finesMacStore.adultOrYouthSectionsCompleted();
        break;
      case 'parentOrGuardianToPay':
        this.mandatorySectionsCompleted = this.finesMacStore.parentGuardianSectionsCompleted();
        break;
      case 'company':
        this.mandatorySectionsCompleted = this.finesMacStore.companySectionsCompleted();
        break;
      default:
        this.mandatorySectionsCompleted = false;
        break;
    }
  }

  /**
   * Performs the initial setup for the fines-mac-account-details component.
   * Sets the defendant type and account type.
   */
  private initialAccountDetailsSetup(): void {
    this.accountDetailsFetchedMappedPayload();
    this.setAccountDetailsStatus();
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
      this.finesMacStore.personalDetailsStatus() === FINES_MAC_STATUS.PROVIDED ||
      this.paymentTermsBypassDefendantTypes.includes(this.defendantType)
    );
  }

  /**
   * Navigates back to the previous page
   * Page navigation set to false to trigger the canDeactivate guard
   */
  public navigateBack(): void {
    if (this.finesDraftStore.amend()) {
      this.handleRoute(
        `${this.finesRoutes.root}/${this.finesDraftRoutes.root}/${this.finesDraftRoutes.children.createAndManage}/${this.finesDraftCheckAndManageRoutes.children.tabs}`,
        false,
        undefined,
        this.finesDraftStore.fragment(),
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
    console.log(this.finesMacStore.accountCommentsNotes().formData);
    this.initialAccountDetailsSetup();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
