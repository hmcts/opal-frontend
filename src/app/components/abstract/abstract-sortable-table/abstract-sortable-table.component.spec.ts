import { TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { AbstractSortableTableComponent } from './abstract-sortable-table.component';
import { SortService } from '@services/sort-service/sort-service';
import { ISortStateInterface } from './interfaces/abtract-sortable-table-interfaces';

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
    override abstractExistingSortState: ISortStateInterface = {
      imposition: 'ascending',
      creditor: 'none',
      amountImposed: 'none',
      amountPaid: 'none',
      balanceRemaining: 'none',
    };
    override abstractSortState = new EventEmitter<ISortStateInterface>();
  }

  it('should initialize with existing sort state', () => {
    const existingState: ISortStateInterface = {
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

  it('should create default sort state if no existing state is provided', () => {
    component.abstractExistingSortState = null;

    component.ngOnInit();

    expect(component.sortState).toEqual({
      imposition: 'none',
      creditor: 'none',
      amountImposed: 'none',
      amountPaid: 'none',
      balanceRemaining: 'none',
    });
  });

  it('should update sort state on sort change', () => {
    component.createSortState(component.abstractTableData);

    const event = { key: 'creditor', sortType: 'ascending' as const };
    component.onSortChange(event);

    expect(component.sortState).toEqual({
      imposition: 'none',
      creditor: 'ascending',
      amountImposed: 'none',
      amountPaid: 'none',
      balanceRemaining: 'none',
    });
  });

  it('should call SortService for ascending sort', () => {
    sortServiceMock.sortObjectsAsc.and.returnValue([
      {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
      },
      { imposition: 'Imposition 1', creditor: 'major', amountImposed: 1000, amountPaid: 200, balanceRemaining: 800 },
      { imposition: 'Imposition 2', creditor: 'minor', amountImposed: 1500, amountPaid: 500, balanceRemaining: 1000 },
    ]);

    component.createSortState(component.abstractTableData);

    component.onSortChange({ key: 'creditor', sortType: 'ascending' });

    expect(sortServiceMock.sortObjectsAsc).toHaveBeenCalledWith(
      [
        { imposition: 'Imposition 1', creditor: 'major', amountImposed: 1000, amountPaid: 200, balanceRemaining: 800 },
        { imposition: 'Imposition 2', creditor: 'minor', amountImposed: 1500, amountPaid: 500, balanceRemaining: 1000 },
        {
          imposition: 'Imposition 3',
          creditor: 'default',
          amountImposed: 2000,
          amountPaid: 1000,
          balanceRemaining: 1000,
        },
      ],
      'creditor',
    );

    expect(component.abstractTableData).toEqual([
      {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
      },
      { imposition: 'Imposition 1', creditor: 'major', amountImposed: 1000, amountPaid: 200, balanceRemaining: 800 },
      { imposition: 'Imposition 2', creditor: 'minor', amountImposed: 1500, amountPaid: 500, balanceRemaining: 1000 },
    ]);
  });


  it('should call SortService for descending sort', () => {
    sortServiceMock.sortObjectsDsc.and.returnValue([
      { imposition: 'Imposition 2', creditor: 'minor', amountImposed: 1500, amountPaid: 500, balanceRemaining: 1000 },
      { imposition: 'Imposition 1', creditor: 'major', amountImposed: 1000, amountPaid: 200, balanceRemaining: 800 },
      {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
      },
    ]);

    component.createSortState(component.abstractTableData);

    component.onSortChange({ key: 'creditor', sortType: 'descending' });

    expect(sortServiceMock.sortObjectsDsc).toHaveBeenCalledWith(
      [
        { imposition: 'Imposition 1', creditor: 'major', amountImposed: 1000, amountPaid: 200, balanceRemaining: 800 },
        { imposition: 'Imposition 2', creditor: 'minor', amountImposed: 1500, amountPaid: 500, balanceRemaining: 1000 },
        {
          imposition: 'Imposition 3',
          creditor: 'default',
          amountImposed: 2000,
          amountPaid: 1000,
          balanceRemaining: 1000,
        },
      ],
      'creditor',
    );

    expect(component.abstractTableData).toEqual([
      { imposition: 'Imposition 2', creditor: 'minor', amountImposed: 1500, amountPaid: 500, balanceRemaining: 1000 },
      { imposition: 'Imposition 1', creditor: 'major', amountImposed: 1000, amountPaid: 200, balanceRemaining: 800 },
      {
        imposition: 'Imposition 3',
        creditor: 'default',
        amountImposed: 2000,
        amountPaid: 1000,
        balanceRemaining: 1000,
      },
    ]);
  });

  it('should emit the updated sort state', () => {
    spyOn(component.abstractSortState, 'emit');

    const event = { key: 'amountImposed', sortType: 'ascending' as const };
    component.onSortChange(event);

    expect(component.abstractSortState.emit).toHaveBeenCalledWith(component.sortState);
  });
});
