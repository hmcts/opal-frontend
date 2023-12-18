import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GovukButtonComponent, PaginationComponent } from '@components';
import { ISearchDefendantAccount, ISearchDefendantAccounts } from '@interfaces';

@Component({
  selector: 'app-matches-table',
  standalone: true,
  imports: [CommonModule, RouterModule, GovukButtonComponent, PaginationComponent, CdkTableModule, PaginationComponent],
  templateUrl: './matches-table.component.html',
  styleUrl: './matches-table.component.scss',
})
export class MatchesTableComponent implements OnInit {
  @Input() data!: ISearchDefendantAccounts;

  public tableData!: MatTableDataSource<ISearchDefendantAccount>;

  public currentPage: number = 1;
  public pageLimit: number = 10;
  public pagedRows!: MatTableDataSource<ISearchDefendantAccount>;

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
  public onPageChanged(event: number): void {
    this.currentPage = event;
    this.pagedRows = this.wrapTableDataSource(this.paginate(this.data.searchResults, this.pageLimit, this.currentPage));
  }

  public ngOnInit(): void {
    this.pagedRows = this.wrapTableDataSource(this.paginate(this.data.searchResults, this.pageLimit, this.currentPage));
  }
}
