import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSortableTableComponent } from './moj-sortable-table.component';

describe('MojSortableTableComponent', () => {
  let component: MojSortableTableComponent;
  let fixture: ComponentFixture<MojSortableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default tableClasses as undefined', () => {
    expect(component.tableClasses).toBeUndefined();
  });

  it('should accept tableClasses as input', () => {
    component.tableClasses = 'test-class';
    fixture.detectChanges();
    expect(component.tableClasses).toBe('test-class');
  });
});
