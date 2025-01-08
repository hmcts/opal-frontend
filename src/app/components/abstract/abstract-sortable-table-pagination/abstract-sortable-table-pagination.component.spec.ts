import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSortableTablePaginationComponent } from './abstract-sortable-table-pagination.component';
import { MOCK_ABSTRACT_TABLE_DATA } from '../abstract-sortable-table/mocks/abstract-sortable-table-data-mock';

class TestComponent extends AbstractSortableTablePaginationComponent {
  constructor() {
    super();
    this.abstractTableData = MOCK_ABSTRACT_TABLE_DATA;
    this.abstractExistingSortState = null;
    this.abstractPaginatedItemsPerPage.set(1);
  }
}

describe('AbstractSortableTablePaginationComponent', () => {
  let component: TestComponent | null;
  let fixture: ComponentFixture<TestComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    expect(component.abstractPaginatedCurrentPage()).toBe(1);
    expect(component.abstractPaginatedItemsPerPage()).toBe(1);
    expect(component.abstractPaginatedStartIndex()).toBe(1);
    expect(component.abstractPaginatedEndIndex()).toBe(1);
    expect(component.abstractPaginatedData).toEqual([MOCK_ABSTRACT_TABLE_DATA[0]]);
  });

  it('should calculate correct pagination indices', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.abstractPaginatedCurrentPage.set(2);
    const indices = (component as any).calculatePaginationIndices();

    expect(indices.startIndex).toBe(1);
    expect(indices.endIndex).toBe(2);
  });

  it('should update paginated data based on the current page and items per page', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.updatePaginatedData();

    expect(component.abstractPaginatedStartIndex()).toBe(1);
    expect(component.abstractPaginatedEndIndex()).toBe(1);
    expect(component.abstractPaginatedData?.length).toBe(1);
    expect(component.abstractPaginatedData).toEqual([MOCK_ABSTRACT_TABLE_DATA[0]]);

    component.abstractPaginatedCurrentPage.set(2);
    component.updatePaginatedData();

    expect(component.abstractPaginatedStartIndex()).toBe(2);
    expect(component.abstractPaginatedEndIndex()).toBe(2);
    expect(component.abstractPaginatedData).toEqual([MOCK_ABSTRACT_TABLE_DATA[1]]);
  });

  it('should update paginated data when abstractTableData is null', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.abstractTableData = null;

    component.updatePaginatedData();

    expect(component.abstractPaginatedStartIndex()).toBe(1);
    expect(component.abstractPaginatedEndIndex()).toBe(0);
    expect(component.abstractPaginatedData).toEqual([]);
  });

  it('should update current page and recalculate paginated data on page change', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.onPageChange(3);

    expect(component.abstractPaginatedCurrentPage()).toBe(3);
    expect(component.abstractPaginatedStartIndex()).toBe(3);
    expect(component.abstractPaginatedEndIndex()).toBe(3);
    expect(component.abstractPaginatedData).toEqual([MOCK_ABSTRACT_TABLE_DATA[2]]);
  });

  it('should listen to sort state changes and update paginated data', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const spy = spyOn(component, 'updatePaginatedData').and.callThrough();
    component['setupSortStateListener'](); // Manually invoke private method for test

    component.abstractSortState.next({ imposition: 'ascending' });

    expect(spy).toHaveBeenCalled();
  });

  it('should clean up subscriptions on destroy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const spy = spyOn(component['ngUnsubscribe$'], 'next').and.callThrough();
    const completeSpy = spyOn(component['ngUnsubscribe$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
