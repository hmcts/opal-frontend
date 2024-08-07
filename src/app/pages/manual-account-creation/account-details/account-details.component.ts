import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import {
  GovukButtonComponent,
  GovukHeadingWithCaptionComponent,
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
  GovukTagComponent,
  GovukTaskListComponent,
  GovukTaskListItemComponent,
} from '@components';
import { ACCOUNT_TYPES_STATE, DEFENDANT_TYPES_STATE, MANUAL_ACCOUNT_CREATION_ACCOUNT_STATUS } from '@constants';

import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import {
  IAccountTypes,
  IDefendantTypes,
  IManualAccountCreationAccountStatus,
  IManualAccountCreationFieldTypes,
  IManualAccountCreationState,
} from '@interfaces';
import { MacStateService } from '@services';

@Component({
  selector: 'app-account-details',
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
  templateUrl: './account-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly macStateService = inject(MacStateService);

  public readonly routingPaths = RoutingPaths;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;
  public accountCreationStatus: IManualAccountCreationAccountStatus = MANUAL_ACCOUNT_CREATION_ACCOUNT_STATUS;

  public readonly defendantTypes = DEFENDANT_TYPES_STATE;
  private readonly accountTypes = ACCOUNT_TYPES_STATE;
  public personalDetailsPopulated!: boolean;

  public defendantType!: string;
  public accountType!: string;

  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { DefendantType } = this.macStateService.manualAccountCreation.accountDetails;
    if (DefendantType) {
      this.defendantType = this.defendantTypes[DefendantType as keyof IDefendantTypes] || '';
    }
  }

  /**
   * Sets the account type based on the value stored in the `manualAccountCreation.accountDetails.accountType` property.
   * If a valid account type is found, it assigns the corresponding value from `accountTypes` to the `accountType` property.
   */
  private setAccountType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { AccountType } = this.macStateService.manualAccountCreation.accountDetails;
    if (AccountType) {
      this.accountType = this.accountTypes[AccountType as keyof IAccountTypes] || '';
    }
  }

  /**
   * Checks if a value is truthy.
   * @param subFieldValue - The value to check.
   * @returns A boolean indicating whether the value is truthy or not.
   */
  private isTruthy(subFieldValue: IManualAccountCreationFieldTypes): boolean {
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
      this.macStateService.manualAccountCreation,
    ) as (keyof IManualAccountCreationState)[];

    accountCreationKeys.forEach((key: keyof IManualAccountCreationState) => {
      if (typeof this.macStateService.manualAccountCreation[key] !== 'boolean') {
        const subFields = this.macStateService.manualAccountCreation[key];
        this.accountCreationStatus[key] = Object.values(subFields).some(this.isTruthy);
      }
    });
  }

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.setDefendantType();
    this.setAccountType();
    this.checkStatus();
  }
}
