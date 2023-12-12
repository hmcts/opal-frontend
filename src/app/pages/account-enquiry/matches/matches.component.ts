import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GovukButtonComponent } from '@components';
import { AccountEnquiryRoutes } from '@enums';
import { DefendantAccountService, StateService } from '@services';
import { EMPTY, Observable, map, of } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ISearchDefendantAccount, ISearchDefendantAccountBody } from '@interfaces';

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
  ],
  providers: [DefendantAccountService],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly stateService = inject(StateService);
  private readonly defendantAccountService = inject(DefendantAccountService);

  public data$: Observable<MatTableDataSource<ISearchDefendantAccount>> = EMPTY;

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

  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.search]);
  }

  private fetchResults(): void {
    const searchState = this.stateService.accountEnquiry().search;
    if (searchState) {
      // TMP: Set court to test
      const postBody: ISearchDefendantAccountBody = { ...searchState, court: 'test' };

      this.data$ = this.defendantAccountService.searchDefendantAccounts(postBody).pipe(
        map((results) => {
          // Wrap the results so we can use the datatable functionality...
          const wrappedTableDataSource = new MatTableDataSource<ISearchDefendantAccount>(results.searchResults);
          wrappedTableDataSource.paginator = this.paginator;
          return wrappedTableDataSource;
        }),
      );
    } else {
      console.error('NO DATA');
    }
  }

  public ngOnInit(): void {
    this.fetchResults();
  }
}
