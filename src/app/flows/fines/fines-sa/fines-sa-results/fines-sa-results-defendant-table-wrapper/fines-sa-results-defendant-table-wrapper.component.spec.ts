import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsDefendantTableWrapperComponent } from './fines-sa-results-defendant-table-wrapper.component';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-sa-results-defendant-table-wrapper-table-sort-default.constant';
import { GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS } from './mock/fines-sa-results-defendant-table-wrapper-table-data.mock';

describe('FinesSaResultsDefendantTableWrapperComponent', () => {
  let component: FinesSaResultsDefendantTableWrapperComponent;
  let fixture: ComponentFixture<FinesSaResultsDefendantTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsDefendantTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsDefendantTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.existingSortState = FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate table data when tableData input is set', () => {
    expect(component['sortedTableDataSignal']()).toEqual(GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1));
  });

  it('should set existingSortState input correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortState = { column: 'Name', direction: 'asc' } as any;

    component.existingSortState = sortState;

    expect(component['abstractExistingSortState']).toEqual(sortState);
  });

  it('should emit account number when goToAccount is called', () => {
    spyOn(component.accountNumberClicked, 'emit');

    component.goToAccount('ACC123');

    expect(component.accountNumberClicked.emit).toHaveBeenCalledWith('ACC123');
  });
});
