import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GovukButtonComponent } from '@components';
import { AccountEnquiryRoutes } from '@enums';
import { DefendantAccountService, StateService } from '@services';
import { Observable, map } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-account-enquiry-matches',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GovukButtonComponent,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
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

  public storedResultsData!: any;

  public data$!: Observable<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['accountNo', 'name', 'dateOfBirth', 'addressLine1', 'balance', 'court'];

  public handleBack(): void {
    this.router.navigate([AccountEnquiryRoutes.search]);
  }

  private fetchResults(): void {
    const postbody = { ...this.stateService.accountEnquiry(), court: 'test' };
    this.data$ = this.defendantAccountService.searchDefendantAccount(postbody).pipe(
      map((results) => {
        this.storedResultsData = results;
        // Wrap the results so we can use the datatable functionality...
        const modified = new MatTableDataSource<any>(results.searchResults);
        modified.paginator = this.paginator;
        return modified;
      }),
    );
  }

  public ngOnInit(): void {
    this.fetchResults();
  }
}
