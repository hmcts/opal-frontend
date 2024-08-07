import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  IFinesMacAccountStatus,
  IFinesMacAccountTypes,
  IFinesMacDefendantTypes,
  IFinesMacFieldTypes,
} from '../interfaces';
import { FINES_MAC_ACCOUNT_STATUS, FINES_MAC_ACCOUNT_TYPES_STATE, FINES_MAC_DEFENDANT_TYPES_STATE } from '../constants';
import { RoutingPaths } from '@enums';
import { FinesMacRoutes } from '../enums';
import { FinesService } from '../../services/fines.service';
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
import { Router, RouterModule } from '@angular/router';

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
  protected readonly finesService = inject(FinesService);

  public readonly routingPaths = RoutingPaths;
  public readonly fineMacRoutes = FinesMacRoutes;
  public accountCreationStatus: IFinesMacAccountStatus = FINES_MAC_ACCOUNT_STATUS;

  protected readonly defendantTypes = FINES_MAC_DEFENDANT_TYPES_STATE;
  private readonly accountTypes = FINES_MAC_ACCOUNT_TYPES_STATE;
  public defendantType!: string;
  public accountType!: string;

  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { DefendantType } = this.finesService.finesMacState.accountDetails;
    if (DefendantType) {
      this.defendantType = this.defendantTypes[DefendantType as keyof IFinesMacDefendantTypes] || '';
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
      this.accountType = this.accountTypes[AccountType as keyof IFinesMacAccountTypes] || '';
    }
  }

  /**
   * Checks if a value is truthy.
   * @param subFieldValue - The value to check.
   * @returns A boolean indicating whether the value is truthy or not.
   */
  private isTruthy(subFieldValue: IFinesMacFieldTypes): boolean {
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
    const accountCreationKeys = Object.keys(this.finesService.finesMacState) as (keyof IFinesMacAccountStatus)[];

    accountCreationKeys.forEach((key: keyof IFinesMacAccountStatus) => {
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
  private initialSetup(): void {
    this.setDefendantType();
    this.setAccountType();
  }

  /**
   * Navigates to the specified route.
   *
   * @param route - The route to navigate to.
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }

  public ngOnInit(): void {
    this.initialSetup();
    this.checkStatus();
  }
}
