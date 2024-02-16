import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesTableComponent } from './matches-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { ISearchDefendantAccount, ISearchDefendantAccounts } from '@interfaces';
import { SEARCH_DEFENDANT_ACCOUNTS_MOCK } from '@mocks';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MatchesTableComponent', () => {
  let component: MatchesTableComponent;
  let fixture: ComponentFixture<MatchesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesTableComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchesTableComponent);
    component = fixture.componentInstance;
    component.data = SEARCH_DEFENDANT_ACCOUNTS_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should wrap table data source', () => {
    const source: ISearchDefendantAccount[] = SEARCH_DEFENDANT_ACCOUNTS_MOCK.searchResults; // Provide test data here
    const wrappedTableDataSource = component['wrapTableDataSource'](source);
    expect(wrappedTableDataSource).toBeInstanceOf(MatTableDataSource);
    expect(wrappedTableDataSource.data).toEqual(source);
  });

  it('should paginate the array correctly', () => {
    const array: ISearchDefendantAccount[] = SEARCH_DEFENDANT_ACCOUNTS_MOCK.searchResults; // Provide test data here
    const pageSize = 2;
    const currentPage = 1;
    const expectedPaginatedArray: ISearchDefendantAccount[] = [
      SEARCH_DEFENDANT_ACCOUNTS_MOCK.searchResults[0],
      SEARCH_DEFENDANT_ACCOUNTS_MOCK.searchResults[1],
    ];

    const result = component['paginate'](array, pageSize, currentPage);

    expect(result).toEqual(expectedPaginatedArray);
  });

  it('should update pagedRows when onPageChanged is called', () => {
    const searchResults: ISearchDefendantAccounts = SEARCH_DEFENDANT_ACCOUNTS_MOCK; // Provide test data here
    const pageLimit = 1;
    const currentPage = 1;
    const expectedPagedRows: MatTableDataSource<ISearchDefendantAccount> = component['wrapTableDataSource']([
      SEARCH_DEFENDANT_ACCOUNTS_MOCK.searchResults[1],
    ]);

    component.data = searchResults;
    component.pageLimit.set(pageLimit);
    component.currentPage.set(currentPage);
    fixture.detectChanges;

    component.handlePageChanged(2);

    expect(component.pagedRows().filteredData).toEqual(expectedPagedRows.filteredData);
  });

  it('should emit view event when handleViewDefendantAccount is called', () => {
    const event = new Event('click');
    const defendantAccountId = 123;
    component.view.subscribe((accountId: number) => {
      expect(accountId).toEqual(defendantAccountId);
    });

    component.handleViewDefendantAccount(event, defendantAccountId);
  });
});
