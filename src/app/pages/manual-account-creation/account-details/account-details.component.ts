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
import { DEFENDANT_TYPES_STATE } from '@constants';

import { ManualAccountCreationRoutes, RoutingPaths } from '@enums';
import { IManualAccountCreationState } from '@interfaces';
import { MacStateService } from '@services';
import { MANUAL_ACCOUNT_CREATION_ACCOUNT_STATUS } from './constants/manual-account-creation-account-status';
import { IManualAccountCreationAccountStatus } from './interfaces/manual-account-creation-account-status.interface';
import { IManualAccountCreationFieldTypes } from './interfaces/manual-account-creation-field-types.interface';

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
  public personalDetailsPopulated!: boolean;

  public defendantType = '';

  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { defendantType } = this.macStateService.manualAccountCreation.accountDetails;
    if (defendantType) {
      this.defendantType = this.defendantTypes[defendantType] || '';
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
    this.checkStatus();
  }
}
