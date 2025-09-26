import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsMinorCreditorTableWrapperComponent } from './fines-sa-results-minor-creditor-table-wrapper.component';
import { GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS } from './mocks/fines-sa-result-minor-creditor-table-wrapper-table-data.mock';
import { FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-sa-result-minor-creditor-table-wrapper-table-sort-default.constant';

describe('FinesSaResultsMinorCreditorTableWrapperComponent', () => {
  let component: FinesSaResultsMinorCreditorTableWrapperComponent;
  let fixture: ComponentFixture<FinesSaResultsMinorCreditorTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsMinorCreditorTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsMinorCreditorTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.existingSortState = FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate table data when tableData input is set', () => {
    expect(component['sortedTableDataSignal']()).toEqual(
      GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS(1),
    );
  });

  it('should set existingSortState input correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortState = { column: 'Name', direction: 'asc' } as any;

    component.existingSortState = sortState;

    expect(component['abstractExistingSortState']).toEqual(sortState);
  });

  it('should emit account number when goToAccount is called', () => {
    spyOn(component.accountIdClicked, 'emit');

    component.goToAccount(123);

    expect(component.accountIdClicked.emit).toHaveBeenCalledWith(123);
  });
});
