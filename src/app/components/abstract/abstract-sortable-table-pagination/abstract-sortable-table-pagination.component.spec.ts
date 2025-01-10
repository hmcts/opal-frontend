import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSortableTablePaginationComponent } from './abstract-sortable-table-pagination.component';
import { MOCK_ABSTRACT_TABLE_DATA } from '../abstract-sortable-table/mocks/abstract-sortable-table-data-mock';

class TestComponent extends AbstractSortableTablePaginationComponent {
  constructor() {
    super();
    this.abstractTableData.set(MOCK_ABSTRACT_TABLE_DATA);
    this.abstractExistingSortState = null;
    this.abstractTablePaginatedItemsPerPage.set(1);
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

    expect(component.abstractTablePaginatedCurrentPage()).toBe(1);
    expect(component.abstractTablePaginatedItemsPerPage()).toBe(1);
    expect(component.abstractTablePaginatedStartIndex()).toBe(1);
    expect(component.abstractTablePaginatedEndIndex()).toBe(1);
    expect(component.abstractTablePaginatedData()).toEqual([MOCK_ABSTRACT_TABLE_DATA[0]]);
  });

  it('should update current page on page change', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.onPageChange(2);
    expect(component.abstractTablePaginatedCurrentPage()).toBe(2);
  });
});
