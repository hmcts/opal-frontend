import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectorRef } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from './abstract-sortable-table-pagination.component';
import { MOCK_ABSTRACT_TABLE_DATA } from '../abstract-sortable-table/mocks/abstract-sortable-table-data-mock';

@Component({
  template: '', // Minimal template for the test component
})
class TestComponent extends AbstractSortableTablePaginationComponent {
  constructor() {
    super();
    this.abstractTableDataSignal.set(MOCK_ABSTRACT_TABLE_DATA);
    this.abstractExistingSortState = null;
    this.itemsPerPageSignal.set(1);
  }
}

describe('AbstractSortableTablePaginationComponent', () => {
  let component: TestComponent | null;
  let fixture: ComponentFixture<TestComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: jasmine.createSpy('detectChanges'), // Mock detectChanges
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent); // Create the TestComponent
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

    expect(component.currentPageSignal()).toBe(1);
    expect(component.itemsPerPageSignal()).toBe(1);
    expect(component['startIndexComputed']()).toBe(1);
    expect(component['endIndexComputed']()).toBe(1);
    expect(component.paginatedTableDataComputed()).toEqual([MOCK_ABSTRACT_TABLE_DATA[0]]);
  });

  it('should update current page on page change', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.onPageChange(2);
    expect(component.currentPageSignal()).toBe(2);
  });

  it('should reset current page to 1 on sort change', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.currentPageSignal.set(2); // Set current page to 2
    component.onSortChange({ key: 'name', sortType: 'ascending' }); // Trigger sort change
    expect(component.currentPageSignal()).toBe(1); // Expect current page to be reset to 1
  });
});
