import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSortableTableFooterComponent } from './shared-sortable-table-footer.component';

describe('SharedSortableTableFooterComponent', () => {
  let component: SharedSortableTableFooterComponent;
  let fixture: ComponentFixture<SharedSortableTableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSortableTableFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedSortableTableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call super.onPageChange and emit changePage on page change', () => {
    const emitSpy = spyOn(component.changePage, 'emit');
    const superSpy = spyOn<any>(SharedSortableTableFooterComponent.prototype, 'onPageChange').and.callThrough();

    component.onPageChange(2);

    expect(superSpy).toHaveBeenCalledWith(2);
    expect(emitSpy).toHaveBeenCalledWith(2);
  });
});
