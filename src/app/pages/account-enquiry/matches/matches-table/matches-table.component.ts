import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, signal } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GovukButtonComponent, GovukPaginationComponent } from '@components';
import { ISearchDefendantAccount, ISearchDefendantAccounts } from '@interfaces';

@Component({
  selector: 'app-matches-table',
  standalone: true,
  imports: [CommonModule, RouterModule, GovukButtonComponent, GovukPaginationComponent, CdkTableModule, MatSortModule],
  templateUrl: './matches-table.component.html',
  styleUrl: './matches-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesTableComponent implements AfterViewInit {
  @Input({ required: true }) data!: ISearchDefendantAccounts;

  @ViewChild(MatSort) sort!: MatSort;

  public currentPage = signal(1);
  public pageLimit = signal(10);
  public pagedRows = signal<MatTableDataSource<ISearchDefendantAccount>>(
    this.wrapTableDataSource(this.paginate([], this.pageLimit(), this.currentPage())),
  );

  public readonly displayedColumns: string[] = [
    'accountNo',
    'name',
    'dateOfBirth',
    'addressLine1',
    'balance',
    'court',
    'view',
  ];

  /**
   * Wraps the provided data source with MatTableDataSource.
   *
   * @param source - The array of ISearchDefendantAccount objects to be wrapped.
   * @returns The wrapped MatTableDataSource instance.
   */
  private wrapTableDataSource(source: ISearchDefendantAccount[]): MatTableDataSource<ISearchDefendantAccount> {
    const wrappedTableDataSource = new MatTableDataSource<ISearchDefendantAccount>(source);
    wrappedTableDataSource.sort = this.sort;
    return wrappedTableDataSource;
  }

  /**
   * Paginates an array of ISearchDefendantAccount objects.
   *
   * @param array - The array to be paginated.
   * @param pageSize - The number of items per page.
   * @param currentPage - The current page number.
   * @returns The paginated array.
   */
  private paginate(array: ISearchDefendantAccount[], pageSize: number, currentPage: number): ISearchDefendantAccount[] {
    return array.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }

  /**
   * Handles the page change event.
   * @param event The new page number.
   */
  public handlePageChanged(event: number): void {
    this.currentPage.set(event);
    this.pagedRows.set(
      this.wrapTableDataSource(this.paginate(this.data.searchResults, this.pageLimit(), this.currentPage())),
    );
  }

  public ngAfterViewInit(): void {
    this.pagedRows.set(
      this.wrapTableDataSource(this.paginate(this.data.searchResults, this.pageLimit(), this.currentPage())),
    );
  }
}
