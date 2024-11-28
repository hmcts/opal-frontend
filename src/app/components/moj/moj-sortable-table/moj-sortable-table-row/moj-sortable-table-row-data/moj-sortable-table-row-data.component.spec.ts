import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSortableTableRowDataComponent } from './moj-sortable-table-row-data.component';

describe('GovukTableBodyRowDataComponent', () => {
  let component: MojSortableTableRowDataComponent;
  let fixture: ComponentFixture<MojSortableTableRowDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableRowDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableRowDataComponent);
    component = fixture.componentInstance;

    component.id = 'testColumn';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host class', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('govuk-table__cell')).toBe(true);
  });

  it('should set the host id to the key input', () => {
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.id).toBe('testColumn');
  });
});
