import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
import { RoutingPaths } from '@enums';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants';
import {
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components/govuk';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { FinesService } from '@services/fines';
import { CanDeactivateTypes } from '@types-guards';
import { Subject, takeUntil } from 'rxjs';
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
    GovukHeadingWithCaptionComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    GovukHeadingWithCaptionComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
  ],
  templateUrl: './fines-mac-account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacAccountDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly finesService = inject(FinesService);

  protected readonly routingPaths = RoutingPaths;
  protected readonly fineMacRoutes = FINES_MAC_ROUTING_PATHS;
  public accountCreationStatus: IFinesMacAccountDetailsAccountStatus = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_STATUS;
  private ngUnsubscribe = new Subject<void>();
  private userNavigatingBack = false;

  protected readonly defendantTypes = FINES_MAC_ACCOUNT_DETAILS_DEFENDANT_TYPES;
  private readonly accountTypes = FINES_MAC_ACCOUNT_DETAILS_ACCOUNT_TYPES;
  public defendantType!: string;
  public accountType!: string;

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateTypes {
    if (this.finesService.finesMacState.unsavedChanges) {
      return false;
    } else {
      return true;
    }
  }

  preventDataLossOnBackGuard(): CanDeactivateTypes {
    if (this.userNavigatingBack) {
      return true;
    }
    return false;
  }

  private routerListener(): void {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
        this.userNavigatingBack = true;
      } else {
        this.userNavigatingBack = false;
      }
    });
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
   * Sets the account type based on the value stored in the `manualAccountCreation.accountDetails.accountType` property.
   * If a valid account type is found, it assigns the corresponding value from `accountTypes` to the `accountType` property.
   */
  private setAccountType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { AccountType } = this.finesService.finesMacState.accountDetails;
    if (AccountType) {
      this.accountType = this.accountTypes[AccountType as keyof IFinesMacAccountDetailsAccountTypes] || '';
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
   * Performs the initial setup for the fines-mac-account-details component.
   * Sets the defendant type and account type.
   */
  private initialAccountDetailsSetup(): void {
    this.setDefendantType();
    this.setAccountType();
    this.checkStatus();
    this.routerListener();
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
}
