import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  IFinesMacAccountDetailsAccountTypes,
  IFinesMacAccountDetailsDefendantTypes,
  IFinesMacAccountDetailsFieldTypes,
  IFinesMacAccountDetailsAccountStatus,
} from './interfaces';
import {
  FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS,
  FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES,
  FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES,
} from './constants';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import {
  GovukBackLinkComponent,
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components/govuk';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, Event as NavigationEvent, NavigationStart } from '@angular/router';
import { FinesService } from '@services/fines';
import { CanDeactivateTypes } from '@types-guards';
import { Subject, takeUntil } from 'rxjs';
import { FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS } from '../fines-mac-language-preferences/constants';
import { IFinesMacLanguagePreferencesOptions } from '../fines-mac-language-preferences/interfaces';

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
    GovukHeadingWithCaptionComponent,
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
  protected readonly finesService = inject(FinesService);

  protected readonly fineMacRoutes = FINES_MAC_ROUTING_PATHS;
  public accountCreationStatus: IFinesMacAccountDetailsAccountStatus = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  protected readonly defendantTypes = FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES;
  private readonly accountTypes = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES;
  protected readonly languageOptions = FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS;
  public defendantType!: string;
  public accountType!: string;
  public documentLanguage!: string;
  public courtHearingLanguage!: string;
  public paymentTermsBypassDefendantTypes = [this.defendantTypes.company, this.defendantTypes.parentOrGuardianToPay];
  public pageNavigation!: boolean;

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
    const { DefendantType } = this.finesService.finesMacState.accountDetails;
    if (DefendantType) {
      this.defendantType = this.defendantTypes[DefendantType as keyof IFinesMacAccountDetailsDefendantTypes] || '';
    }
  }

  /**
   * Sets the account type based on the value in the `finesMacState.accountDetails` object.
   * If the `AccountType` property is defined, it maps the value to the corresponding account type
   * from the `accountTypes` array and assigns it to the `accountType` property.
   */
  private setAccountType(): void {
    const { AccountType } = this.finesService.finesMacState.accountDetails;
    if (AccountType) {
      this.accountType = this.accountTypes[AccountType as keyof IFinesMacAccountDetailsAccountTypes] || '';
    }
  }

  /**
   * Sets the document language and court hearing language based on the language preferences
   * stored in the finesMacState.
   */
  private setLanguage(): void {
    const { documentLanguage, courtHearingLanguage } = this.finesService.finesMacState.languagePreferences;
    if (documentLanguage && courtHearingLanguage) {
      this.documentLanguage = this.languageOptions[documentLanguage as keyof IFinesMacLanguagePreferencesOptions] || '';
      this.courtHearingLanguage =
        this.languageOptions[courtHearingLanguage as keyof IFinesMacLanguagePreferencesOptions] || '';
    }
  }

  /**
   * Checks if a value is truthy.
   * @param subFieldValue - The value to check.
   * @returns A boolean indicating whether the value is truthy or not.
   */
  private isTruthy(subFieldValue: IFinesMacAccountDetailsFieldTypes): boolean {
    if (typeof subFieldValue === 'string') {
      return !!subFieldValue;
    } else if (Array.isArray(subFieldValue)) {
      return false;
    } else {
      return !!subFieldValue;
    }
  }

  /**
   * Checks the status of the manual account creation process.
   * Updates the `accountCreationStatus` object based on the values in `manualAccountCreation`.
   */
  private checkStatus(): void {
    const accountCreationKeys = Object.keys(
      this.finesService.finesMacState,
    ) as (keyof IFinesMacAccountDetailsAccountStatus)[];

    accountCreationKeys.forEach((key: keyof IFinesMacAccountDetailsAccountStatus) => {
      if (typeof this.finesService.finesMacState[key] !== 'boolean') {
        const subFields = this.finesService.finesMacState[key];
        this.accountCreationStatus[key] = Object.values(subFields).some(this.isTruthy);
      }
    });
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
   * Performs the initial setup for the fines-mac-account-details component.
   * Sets the defendant type and account type.
   */
  private initialAccountDetailsSetup(): void {
    this.setDefendantType();
    this.setAccountType();
    this.setLanguage();
    this.checkStatus();
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
      this.accountCreationStatus['personalDetails'] ||
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
