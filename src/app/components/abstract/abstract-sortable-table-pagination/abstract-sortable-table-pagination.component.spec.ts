import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSortableTablePaginationComponent } from './abstract-sortable-table-pagination.component';

class TestComponent extends AbstractSortableTablePaginationComponent {
  constructor() {
    super();
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

  it('should update paginated data correctly', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.abstractTableData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ];
    component.abstractCurrentPage = 1;
    component.abstractItemsPerPage = 2;

    component.updatePaginatedData();

    expect(component.abstractPaginatedData).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);

    component.abstractCurrentPage = 2;
    component.updatePaginatedData();

    expect(component.abstractPaginatedData).toEqual([
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ]);

    component.abstractCurrentPage = 3;
    component.updatePaginatedData();

    expect(component.abstractPaginatedData).toEqual([{ id: 5, name: 'Item 5' }]);
  });

  it('should set paginated data to null if abstractTableData is null', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.abstractTableData = null;
    component.updatePaginatedData();
    expect(component.abstractPaginatedData).toBeNull();
  });

  it('should change page and update paginated data', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.abstractTableData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
    ];
    component.abstractCurrentPage = 1;
    component.abstractItemsPerPage = 2;

    component.onPageChange(2);

    expect(component.abstractCurrentPage).toBe(2);
    expect(component.abstractPaginatedData).toEqual([
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ]);
  });
});
