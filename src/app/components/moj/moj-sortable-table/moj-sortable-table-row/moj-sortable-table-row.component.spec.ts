import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojSortableTableRowComponent } from './moj-sortable-table-row.component';

describe('MojSortableTableRowComponent;', () => {
  let component: MojSortableTableRowComponent;
  let fixture: ComponentFixture<MojSortableTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host class', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-table__row')).toBe(true);
  });

  it('should accept tableClasses as input', () => {
    component.bodyRowClasses = 'test-class';
    fixture.detectChanges();
    expect(component.bodyRowClasses).toBe('test-class');
  });
});
