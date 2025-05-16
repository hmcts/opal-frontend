import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSharedSortableTableFooterComponent } from './fines-shared-sortable-table-footer.component';

describe('SharedSortableTableFooterComponent', () => {
  let component: FinesSharedSortableTableFooterComponent;
  let fixture: ComponentFixture<FinesSharedSortableTableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSharedSortableTableFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSharedSortableTableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call super.onPageChange and emit changePage on page change', () => {
    const emitSpy = spyOn(component.changePage, 'emit');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const superSpy = spyOn<any>(FinesSharedSortableTableFooterComponent.prototype, 'onPageChange').and.callThrough();

    component.onPageChange(2);

    expect(superSpy).toHaveBeenCalledWith(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });
});
