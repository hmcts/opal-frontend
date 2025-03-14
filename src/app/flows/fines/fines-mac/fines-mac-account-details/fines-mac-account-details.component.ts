import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { IFinesMacAccountDetailsAccountStatus } from './interfaces/fines-mac-account-details-account-status.interface';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS } from './constants/fines-mac-account-details-account-status';
import { FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES } from './constants/fines-mac-account-details-account-types';
import { FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES } from './constants/fines-mac-account-details-defendant-types';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { GovukBackLinkComponent } from '@components/govuk/govuk-back-link/govuk-back-link.component';
import { GovukButtonComponent } from 'opal-frontend-common';
import { GovukSummaryListComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list.component';
import { GovukSummaryListRowComponent } from '@components/govuk/govuk-summary-list/govuk-summary-list-row/govuk-summary-list-row.component';
import { GovukTagComponent } from '@components/govuk/govuk-tag/govuk-tag.component';
import { GovukTaskListComponent } from '@components/govuk/govuk-task-list/govuk-task-list.component';
import { GovukTaskListItemComponent } from '@components/govuk/govuk-task-list/govuk-task-list-item/govuk-task-list-item.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../fines-mac-language-preferences/constants/fines-mac-language-preferences-options';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces/fines-mac-language-preferences-options.interface';
import { FINES_MAC_STATUS } from '../constants/fines-mac-status';
import { IFinesMacAccountTypes } from '../interfaces/fines-mac-account-types.interface';
import { IFinesMacDefendantTypes } from '../interfaces/fines-mac-defendant-types.interface';
import { FinesMacStore } from '../stores/fines-mac.store';
import { CanDeactivateTypes } from 'opal-frontend-common';

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
  ],
  templateUrl: './fines-mac-account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountDetailsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesMacStore = inject(FinesMacStore);

  protected readonly fineMacRoutes = FINES_MAC_ROUTING_PATHS;
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

  /**
   * Determines whether the component can be deactivated.
   * @returns A CanDeactivateTypes object representing the navigation status.
   */
  canDeactivate(): CanDeactivateTypes {
    return this.pageNavigation;
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
    this.pageNavigation = false;
    this.handleRoute(this.fineMacRoutes.children.createAccount);
  }

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (nonRelative) {
      this.router.navigate([route]);
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
