import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesDraftTableWrapperComponent } from './fines-draft-table-wrapper.component';
import { IFinesDraftTableWrapperTableData } from './interfaces/fines-draft-table-wrapper-table-data.interface';
import { IFinesDraftTableWrapperTableSort } from './interfaces/fines-draft-table-wrapper-table-sort.interface';
import { FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT } from './constants/fines-draft-table-wrapper-table-sort-default.constant';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from './mocks/fines-draft-table-wrapper-table-data.mock';

describe('FinesDraftTableWrapperComponent', () => {
  let component: FinesDraftTableWrapperComponent;
  let fixture: ComponentFixture<FinesDraftTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesDraftTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesDraftTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK;
    component.existingSortState = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set abstractTableData when tableData input is provided', () => {
    const testData: IFinesDraftTableWrapperTableData[] = FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK;
    component.tableData = testData;
    expect(component.abstractTableData()).toEqual(testData);
  });

  it('should set abstractExistingSortState when existingSortState input is provided', () => {
    const sortState: IFinesDraftTableWrapperTableSort = FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT;
    component.existingSortState = sortState;
    expect(component.abstractExistingSortState).toEqual(sortState);
  });

  it('should accept isApprovedTab input', () => {
    component.isApprovedTab = true;
    expect(component.isApprovedTab).toBeTrue();
  });
});
