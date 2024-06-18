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
import { StateService } from '@services';

@Component({
  selector: 'app-create-account',
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
  templateUrl: './create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);

  public readonly routingPaths = RoutingPaths;
  public readonly manualAccountCreationRoutes = ManualAccountCreationRoutes;

  public readonly defendantTypes = DEFENDANT_TYPES_STATE;

  public defendantType = '';

  /**
   * Sets the defendant type based on the value stored in the account details.
   * If the defendant type is found in the `defendantTypes` array, it is assigned to `this.defendantType`.
   */
  private setDefendantType(): void {
    // Moved to here as inline was adding extra spaces in HTML...
    const { defendantType } = this.stateService.manualAccountCreation.accountDetails;
    if (defendantType) {
      this.defendantType = this.defendantTypes[defendantType] || '';
    }
  }

  /**
   * Handles route with the supplied route
   *
   * @param route string of route
  /**
   * Handles route with the supplied route
   *
   * @param route string of route
   * Handles route with the supplied route
   *
   * @param route string of route
   */
  public handleRoute(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.setDefendantType();
  }

  /**
   * Checks if the defendant type is 'parentOrGuardianToPay'.
   *
   * @returns {boolean} - Returns true if the defendant type is 'parentOrGuardianToPay', otherwise false.
   */
  public isParentOrGuardianDefendantType(): boolean {
    return this.stateService.manualAccountCreation.accountDetails.defendantType === 'parentOrGuardianToPay';
  }

  /**
   * Checks if the defendant type is 'adultOrYouthOnly'.
   *
   * @returns {boolean} - Returns true if the defendant type is 'adultOrYouthOnly', otherwise false.
   */
  public isAdultOrYouthOnlyDefendantType(): boolean {
    return this.stateService.manualAccountCreation.accountDetails.defendantType === 'adultOrYouthOnly';
  }

  /**
   * Checks if the defendant type is 'company'.
   *
   * @returns {boolean} - Returns true if the defendant type is 'company', otherwise false.
   */
  public isCompanyType(): boolean {
    return this.stateService.manualAccountCreation.accountDetails.defendantType === 'company';
  }
}
