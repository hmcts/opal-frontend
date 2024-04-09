import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GovukButtonComponent } from '@components';
import { AccountEnquiryRoutes } from '@enums';
import { DefendantAccountService, StateService } from '@services';
import { Observable } from 'rxjs';
import { ISearchDefendantAccounts } from '@interfaces';
import { MatchesTableComponent } from './matches-table/matches-table.component';

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, MatchesTableComponent],
  providers: [DefendantAccountService],
  templateUrl: './matches.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent {
  public readonly stateService = inject(StateService);
  private readonly router = inject(Router);
  private readonly defendantAccountService = inject(DefendantAccountService);

  private readonly searchState = this.stateService.accountEnquiry.search;
  public readonly error = this.stateService.error();

  public data$: Observable<ISearchDefendantAccounts> = this.defendantAccountService.searchDefendantAccounts({
    ...this.searchState,
  });

  /**
   * Navigates back to the account search page.
   */
  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.search]);
  }

  /**
   * Navigates to the details page of a defendant account.
   *
   * @param defendantAccountId - The ID of the defendant account.
   */
  public handleViewDefendantAccount(defendantAccountId: number): void {
    this.router.navigate([AccountEnquiryRoutes.details, defendantAccountId]);
  }
}
