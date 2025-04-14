import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSortableTableComponent } from './abstract-sortable-table.component';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState, IAbstractTableData } from './interfaces/abstract-sortable-table-interfaces';
import { ABSTRACT_EXISTING_SORT_STATE_MOCK } from './mocks/abstract-sortable-table-existing-sort-state-mock';
import { MOCK_ABSTRACT_TABLE_DATA } from './mocks/abstract-sortable-table-data-mock';
import { SortableValues } from '@services/sort-service/types/sort-service-type';
import { signal } from '@angular/core';

class TestComponent extends AbstractSortableTableComponent {
  constructor() {
    super();
    this.abstractTableDataSignal.set(MOCK_ABSTRACT_TABLE_DATA);
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
    const newSortState = signal({ ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' } as IAbstractSortState);
    component.abstractExistingSortState = null;
    fixture.detectChanges();

    component['initialiseSortState']();
    expect(component.sortStateSignal()).toEqual(newSortState());
  });

  it('should not init with an existing sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState = signal({ ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' } as IAbstractSortState);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sortStateSignal()).toEqual(newSortState());
  });

  it('should set an existing sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState = signal({ ...ABSTRACT_EXISTING_SORT_STATE_MOCK } as IAbstractSortState);
    component.abstractExistingSortState = newSortState();
    fixture.detectChanges();

    component['initialiseSortState']();
    expect(component.sortStateSignal()).toEqual(newSortState());
  });

  it('should init with a new sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState = signal({ ...ABSTRACT_EXISTING_SORT_STATE_MOCK } as IAbstractSortState);
    component.abstractExistingSortState = newSortState();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.sortStateSignal()).toEqual(newSortState());
  });

  it('should create a new sort state', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState = signal({ ...ABSTRACT_EXISTING_SORT_STATE_MOCK, imposition: 'none' } as IAbstractSortState);
    const sortState = signal(component['createSortState'](MOCK_ABSTRACT_TABLE_DATA));
    fixture.detectChanges();
    expect(sortState()).toEqual(newSortState());
  });

  it('should create a new sort state when tableData is null', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const newSortState = signal({});
    const sortState = signal(component['createSortState']([]));
    fixture.detectChanges();
    expect(sortState()).toEqual(newSortState());
  });

  it('should update sort state and sort data in ascending order', () => {
    if (!component || !service || !fixture) {
      fail('component, service or fixture returned null');
      return;
    }
    const event = { key: 'amountPaid', sortType: 'ascending' as const };
    const sortedData = service.sortObjectArrayAsc(
      MOCK_ABSTRACT_TABLE_DATA,
      'amountPaid',
    ) as IAbstractTableData<SortableValues>[];
    const newSortState = signal({
      ...ABSTRACT_EXISTING_SORT_STATE_MOCK,
      imposition: 'none',
      amountPaid: 'ascending',
    } as IAbstractSortState);
    spyOn(component.abstractSortState, 'emit');

    component['onSortChange'](event);

    expect(component.sortStateSignal()).toEqual(newSortState());
    expect(component.abstractTableDataSignal()).toEqual(sortedData);
    expect(component.abstractSortState.emit).toHaveBeenCalledWith(component.sortStateSignal());
  });

  it('should update sort state and sort data in descending order', () => {
    if (!component || !service || !fixture) {
      fail('component, service or fixture returned null');
      return;
    }

    const event = { key: 'amountPaid', sortType: 'descending' as const };
    const sortedData = service.sortObjectArrayDesc(
      MOCK_ABSTRACT_TABLE_DATA,
      'amountPaid',
    ) as IAbstractTableData<SortableValues>[];
    const newSortState = signal({
      ...ABSTRACT_EXISTING_SORT_STATE_MOCK,
      imposition: 'none',
      amountPaid: 'descending',
    } as IAbstractSortState);
    spyOn(component.abstractSortState, 'emit');

    component['onSortChange'](event);

    expect(component.sortStateSignal()).toEqual(newSortState());
    expect(component.abstractTableDataSignal()).toEqual(sortedData);
    expect(component.abstractSortState.emit).toHaveBeenCalledWith(component.sortStateSignal());
  });

  it('should set sorted column signals when a sorted column is found', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    component.sortStateSignal.set(structuredClone(ABSTRACT_EXISTING_SORT_STATE_MOCK));

    component['getSortedColumn']();

    expect(component.sortedColumnTitleSignal()).toBe('imposition');
    expect(component.sortedColumnDirectionSignal()).toBe('ascending');
  });

  it('should set sorted column signals to empty when no sorted column is found', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    component.sortStateSignal.set({});

    component['getSortedColumn']();

    expect(component.sortedColumnTitleSignal()).toBe('');
    expect(component.sortedColumnDirectionSignal()).toBe('none');
  });
});
