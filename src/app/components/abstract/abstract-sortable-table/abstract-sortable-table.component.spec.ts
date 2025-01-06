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
  let component: TestComponent | null;
  let fixture: ComponentFixture<TestComponent> | null;
  let service: SortService | null;

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

  afterAll(() => {
    component = null;
    fixture = null;
    service = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set existing sort state', () => {
    if (!component || !service || !fixture) {
      fail('component, service or fixture returned null');
      return;
    }
    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' };
    component.abstractExistingSortState = null;
    fixture.detectChanges();

    component['initialiseSortState']();
    expect(component.sortState).toEqual(newSortState);
  });

  it('should not init with an existing sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' };
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sortState).toEqual(newSortState);
  });

  it('should set an existing sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK };
    component.abstractExistingSortState = newSortState;
    fixture.detectChanges();

    component['initialiseSortState']();
    expect(component.sortState).toEqual(newSortState);
  });

  it('should init with a new sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK };
    component.abstractExistingSortState = newSortState;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sortState).toEqual(newSortState);
  });

  it('should create a new sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState: IAbstractSortState = { ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' };
    const sortState = component['createSortState'](MOCK_ABSTRACT_TABLE_DATA);
    fixture.detectChanges();
    expect(sortState).toEqual(newSortState);
  });

  it('should update sort state and sort data in ascending order', () => {
    if (!component || !service || !fixture) {
      fail('component, service or fixture returned null');
      return;
    }
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
    if (!component || !service || !fixture) {
      fail('component, service or fixture returned null');
      return;
    }

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
  it('should update paginated data correctly', () => {
    component.abstractTableData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ];
    component.abstractcurrentPage = 1;
    component.abstractitemsPerPage = 2;

    component.updatePaginatedData();

    expect(component.abstractpaginatedData).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);

    component.abstractcurrentPage = 2;
    component.updatePaginatedData();

    expect(component.abstractpaginatedData).toEqual([
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ]);

    component.abstractcurrentPage = 3;
    component.updatePaginatedData();

    expect(component.abstractpaginatedData).toEqual([{ id: 5, name: 'Item 5' }]);
  });

  it('should set paginated data to null if abstractTableData is null', () => {
    component.abstractTableData = null;
    component.updatePaginatedData();
    expect(component.abstractpaginatedData).toBeNull();
  });

  it('should change page and update paginated data', () => {
    component.abstractTableData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ];
    component.abstractcurrentPage = 1;
    component.abstractitemsPerPage = 2;

    component.onPageChange(2);

    expect(component.abstractcurrentPage).toBe(2);
    expect(component.abstractpaginatedData).toEqual([
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ]);
  });
});
