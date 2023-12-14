import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GovukButtonComponent } from '@components';
import { AccountEnquiryRoutes } from '@enums';
import { DefendantAccountService, StateService } from '@services';
import { Observable, map } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ISearchDefendantAccount, ISearchDefendantAccountBody } from '@interfaces';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukButtonComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    CdkTableModule,
    MatSortModule,
  ],
  providers: [DefendantAccountService],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);
  private readonly defendantAccountService = inject(DefendantAccountService);

  public data$!: Observable<MatTableDataSource<ISearchDefendantAccount>>;

  public error = this.stateService.error();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly displayedColumns: string[] = [
    'accountNo',
    'name',
    'dateOfBirth',
    'addressLine1',
    'balance',
    'court',
    'view',
  ];

  private wrapTableDataSource(source: ISearchDefendantAccount[]): MatTableDataSource<ISearchDefendantAccount> {
    const wrappedTableDataSource = new MatTableDataSource<ISearchDefendantAccount>(source);
    wrappedTableDataSource.paginator = this.paginator;
    return wrappedTableDataSource;
  }

  private fetchResults(): void {
    const searchState = this.stateService.accountEnquiry().search;

    if (searchState) {
      // TMP: Set court to test
      const postBody: ISearchDefendantAccountBody = { ...searchState, court: 'test' };

      this.data$ = this.defendantAccountService
        .searchDefendantAccounts(postBody)
        .pipe(map((results) => this.wrapTableDataSource(results.searchResults)));
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
