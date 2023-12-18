import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { GovukButtonComponent } from '@components';
import { AccountEnquiryRoutes } from '@enums';
import { DefendantAccountService, StateService } from '@services';
import { Observable } from 'rxjs';
import { ISearchDefendantAccountBody, ISearchDefendantAccounts } from '@interfaces';
import { MatchesTableComponent } from './matches-table/matches-table.component';

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [CommonModule, GovukButtonComponent, MatchesTableComponent],
  providers: [DefendantAccountService],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly defendantAccountService = inject(DefendantAccountService);

  public readonly stateService = inject(StateService);
  private readonly searchState = this.stateService.accountEnquiry().search || null;
  public data$!: Observable<ISearchDefendantAccounts>;
  public readonly error = this.stateService.error();

  private fetchResults(): void {
    const searchState = this.stateService.accountEnquiry().search;

    if (searchState) {
      const postBody: ISearchDefendantAccountBody = { ...searchState, court: 'test' };
      this.data$ = this.defendantAccountService.searchDefendantAccounts(postBody);
    } else {
      console.error('NO DATA');
    }
  }

  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.search]);
  }

  public ngOnInit(): void {
    this.fetchResults();
  }
}
