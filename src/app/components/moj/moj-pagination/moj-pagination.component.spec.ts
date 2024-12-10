import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojPaginationComponent } from './moj-pagination.component';

describe('MojPaginationComponent', () => {
  let component: MojPaginationComponent;
  let fixture: ComponentFixture<MojPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate pages correctly', () => {
    component.limit = 10;
    component.total = 100;
    component.currentPage = 1;
    component.ngOnChanges();
    expect(component.totalPages).toBe(10);
    expect(component.pages).toEqual([1, 2, 3, 4, 5, '...', 10]);
  });

  it('should calculate pages correctly for a single page', () => {
    component.limit = 10;
    component.total = 5;
    component.currentPage = 1;
    component.ngOnChanges();
    expect(component.totalPages).toBe(1);
    expect(component.pages).toEqual([1]);
  });

  it('should show correct range of results', () => {
    component.limit = 10;
    component.total = 35;
    component.currentPage = 2;
    component.ngOnChanges();
    expect(component.startItem).toBe(11);
    expect(component.endItem).toBe(20);
    expect(component.totalItems).toBe(35);
  });

  it('should prevent default action on page link click', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    spyOn(event, 'preventDefault');

    component.changePageEvent(event, 2);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should emit changePage event when a valid page is clicked', () => {
    spyOn(component.changePage, 'emit');
    component.currentPage = 1;
    component.totalPages = 10;

    component.changePageEvent(new MouseEvent('click'), 2);

    expect(component.changePage.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit changePage event if page is the same', () => {
    spyOn(component.changePage, 'emit');
    component.currentPage = 1;

    component.changePageEvent(new MouseEvent('click'), 1);

    expect(component.changePage.emit).not.toHaveBeenCalled();
  });

  it('should not emit changePage event if page is out of range', () => {
    spyOn(component.changePage, 'emit');
    component.currentPage = 1;
    component.totalPages = 10;

    component.changePageEvent(new MouseEvent('click'), 0);
    component.changePageEvent(new MouseEvent('click'), 11);

    expect(component.changePage.emit).not.toHaveBeenCalled();
  });

  it('should display ellipses correctly when current page is near the start', () => {
    component.limit = 10;
    component.total = 100;
    component.currentPage = 2;
    component.ngOnChanges();
    expect(component.pages).toEqual([1, 2, 3, 4, 5, '...', 10]);
  });

  it('should display ellipses correctly when current page is near the end', () => {
    component.limit = 10;
    component.total = 100;
    component.currentPage = 9;
    component.ngOnChanges();
    expect(component.pages).toEqual([1, '...', 6, 7, 8, 9, 10]);
  });

  it('should handle edge cases with large total and small limit', () => {
    component.limit = 1;
    component.total = 1000;
    component.currentPage = 500;
    component.ngOnChanges();
    expect(component.totalPages).toBe(1000);
    expect(component.pages.length).toBeLessThanOrEqual(9);
  });
});
