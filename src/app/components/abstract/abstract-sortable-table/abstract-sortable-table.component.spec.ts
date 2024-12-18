import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSortableTableComponent } from './abstract-sortable-table.component';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState } from './interfaces/abstract-sortable-table-interfaces';
import { ABSTRACT_EXISTING_SORT_STATE_MOCK } from './mocks/abstract-sortable-table-existing-sort-state-mock';
import { MOCK_ABSTRACT_TABLE_DATA } from './mocks/abstract-sortable-table-data-mock';

class TestComponent extends AbstractSortableTableComponent {
  constructor() {
    super();
    this.abstractTableData = MOCK_ABSTRACT_TABLE_DATA;
    this.abstractExistingSortState = null;
  }
}

describe('AbstractSortableTableComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let service: SortService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [SortService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SortService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set existing sort state', () => {
    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' };
    component.abstractExistingSortState = null;
    fixture.detectChanges();

    component['initialiseSortState']();
    expect(component.sortState).toEqual(newSortState);
  });

  it('should not init with an existing sort state', () => {
    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' };
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sortState).toEqual(newSortState);
  });

  it('should set an existing sort state', () => {
    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK };
    component.abstractExistingSortState = newSortState;
    fixture.detectChanges();

    component['initialiseSortState']();
    expect(component.sortState).toEqual(newSortState);
  });

  it('should init with a new sort state', () => {
    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK };
    component.abstractExistingSortState = newSortState;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sortState).toEqual(newSortState);
  });

  it('should create a new sort state', () => {
    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' };
    const sortState = component['createSortState'](MOCK_ABSTRACT_TABLE_DATA);
    fixture.detectChanges();
    expect(sortState).toEqual(newSortState);
  });

  it('should update sort state and sort data in ascending order', () => {
    const event = { key: 'amountPaid', sortType: 'ascending' as const };
    const sortedData = service.sortObjectArrayAsc(MOCK_ABSTRACT_TABLE_DATA, 'amountPaid');
    const newSortState: IAbstractSortState = {
      ...ABSTRACT_EXISTING_SORT_STATE_MOCK,
      imposition: 'none',
      amountPaid: 'ascending',
    };
    spyOn(component.abstractSortState, 'emit');

    component['onSortChange'](event);

    expect(component.sortState).toEqual(newSortState);
    expect(component.abstractTableData).toEqual(sortedData);
    expect(component.abstractSortState.emit).toHaveBeenCalledWith(component.sortState);
  });

  it('should update sort state and sort data in descending order', () => {
    const event = { key: 'amountPaid', sortType: 'descending' as const };
    const sortedData = service.sortObjectArrayDesc(MOCK_ABSTRACT_TABLE_DATA, 'amountPaid');
    const newSortState: IAbstractSortState = {
      ...ABSTRACT_EXISTING_SORT_STATE_MOCK,
      imposition: 'none',
      amountPaid: 'descending',
    };
    spyOn(component.abstractSortState, 'emit');

    component['onSortChange'](event);

    expect(component.sortState).toEqual(newSortState);
    expect(component.abstractTableData).toEqual(sortedData);
    expect(component.abstractSortState.emit).toHaveBeenCalledWith(component.sortState);
  });
});
