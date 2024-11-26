import { TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { AbstractSortableTableComponent } from './abstract-sortable-table.component';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState } from './interfaces/abstract-sortable-table-interfaces';

describe('AbstractSortableTableComponent', () => {
  let component: AbstractSortableTableComponent;
  let sortServiceMock: jasmine.SpyObj<SortService>;

  beforeEach(() => {
    sortServiceMock = jasmine.createSpyObj('SortService', ['sortObjectsAsc', 'sortObjectsDsc']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SortService, useValue: sortServiceMock },
        { provide: AbstractSortableTableComponent, useClass: TestComponent },
      ],
    });

    component = TestBed.inject(AbstractSortableTableComponent);
  });

  class TestComponent extends AbstractSortableTableComponent {
    override abstractTableData = [
      {
        imposition: 'Imposition 1',
        creditor: 'major',
        amountImposed: 1000,
        amountPaid: 200,
        balanceRemaining: 800,
      },
      {
        imposition: 'Imposition 2',
        creditor: 'minor',
        amountImposed: 1500,
        amountPaid: 500,
        balanceRemaining: 1000,
      },
      {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
      },
    ];
    override abstractExistingSortState: IAbstractSortState = {
      imposition: 'ascending',
      creditor: 'none',
      amountImposed: 'none',
      amountPaid: 'none',
      balanceRemaining: 'none',
    };
    override abstractSortState = new EventEmitter<IAbstractSortState>();
  }
  describe('createSortState', () => {
    it('should set sortState to an empty object when tableData is empty', () => {
      component.createSortState([]);
      expect(component.sortState).toEqual({});
    });

    it('should initialize sortState with "none" for each key in tableData', () => {
      component.createSortState(component.abstractTableData);
      expect(component.sortState).toEqual({
        imposition: 'none',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'none',
        balanceRemaining: 'none',
      });
    });
  });

  describe('initialiseSortState', () => {
    it('should initialize with the existing sort state if provided', () => {
      component['initialiseSortState']();

      expect(component.sortState).toEqual({
        imposition: 'ascending',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'none',
        balanceRemaining: 'none',
      });
    });

    it('should create a default sort state if no existing state is provided', () => {
      component.abstractExistingSortState = null;

      component['initialiseSortState']();

      expect(component.sortState).toEqual({
        imposition: 'none',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'none',
        balanceRemaining: 'none',
      });
    });
  });

  describe('setSortState', () => {
    it('should update the sort state with the provided value', () => {
      const newSortState: IAbstractSortState = {
        imposition: 'descending',
        creditor: 'ascending',
        amountImposed: 'none',
        amountPaid: 'none',
        balanceRemaining: 'ascending',
      };

      component['setSortState'](newSortState);

      expect(component.sortState).toEqual(newSortState);
    });
  });

  it('should initialize with existing sort state', () => {
    const existingState: IAbstractSortState = {
      imposition: 'ascending',
      creditor: 'none',
      amountImposed: 'none',
      amountPaid: 'none',
      balanceRemaining: 'none',
    };
    component.abstractExistingSortState = existingState;

    component.ngOnInit();

    expect(component.sortState).toEqual(existingState);
  });

  describe('onSortChange', () => {
    it('should reset other keys to "none" and update sortState for ascending', () => {
      component.createSortState(component.abstractTableData);
      const event = { key: 'amountPaid', sortType: 'ascending' as const };

      sortServiceMock.sortObjectsAsc.and.returnValue(component.abstractTableData);

      component.onSortChange(event);

      expect(component.sortState).toEqual({
        imposition: 'none',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'ascending',
        balanceRemaining: 'none',
      });
    });

    it('should reset other keys to "none" and update sortState for descending', () => {
      component.createSortState(component.abstractTableData);
      const event = { key: 'amountPaid', sortType: 'descending' as const };

      sortServiceMock.sortObjectsDsc.and.returnValue(component.abstractTableData);

      component.onSortChange(event);

      expect(component.sortState).toEqual({
        imposition: 'none',
        creditor: 'none',
        amountImposed: 'none',
        amountPaid: 'descending',
        balanceRemaining: 'none',
      });
    });
  });

  it('should emit the updated sort state', () => {
    spyOn(component.abstractSortState, 'emit');

    const event = { key: 'amountImposed', sortType: 'ascending' as const };
    component.onSortChange(event);

    expect(component.abstractSortState.emit).toHaveBeenCalledWith(component.sortState);
  });
});
