import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojPaginationComponent } from './moj-pagination.component';
import { MojPaginationItemComponent } from './moj-pagination-item/moj-pagination-item.component';
import { MojPaginationLinkComponent } from './moj-pagination-link/moj-pagination-link.component';
import { CommonModule } from '@angular/common';

describe('MojPaginationComponent', () => {
  let component: MojPaginationComponent;
  let fixture: ComponentFixture<MojPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MojPaginationComponent, MojPaginationItemComponent, MojPaginationLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update signals when inputs change (ngOnChanges)', () => {
    component.currentPage = 2;
    component.total = 50;
    component.limit = 10;
    component.ngOnChanges();
    expect(component.totalPages()).toBe(5);
    expect(component.pages()).toEqual([1, 2, 3, 4, 5]);
    expect(component.startItem()).toBe(11);
    expect(component.endItem()).toBe(20);
    expect(component.totalItems()).toBe(50);
  });

  it('should return correct total pages (getTotalPages)', () => {
    expect(component['getTotalPages'](100, 10)).toBe(10);
    expect(component['getTotalPages'](5, 10)).toBe(1);
  });

  it('should return the correct start item index (getStartItem)', () => {
    expect(component['getStartItem'](2, 10)).toBe(11);
  });

  it('should return the correct end item index (getEndItem)', () => {
    expect(component['getEndItem'](2, 10, 35)).toBe(20);
    expect(component['getEndItem'](4, 10, 35)).toBe(35);
  });

  it('should generate pages with ellipses for large ranges (getPages)', () => {
    const pages = component['getPages'](4, 10);
    expect(pages).toEqual([1, '...', 2, 3, 4, 5, 6, '...', 10]);
  });

  it('should generate pages without ellipses for small ranges (getPages)', () => {
    const pages = component['getPages'](2, 3);
    expect(pages).toEqual([1, 2, 3]);
  });

  it('should generate pages with correct range near the start (getPages)', () => {
    const pages = component['getPages'](2, 10);
    expect(pages).toEqual([1, 2, 3, 4, 5, '...', 10]);
  });

  it('should calculate page range correctly (calculateStartPage)', () => {
    const rangeMiddle = component['calculateStartPage'](5, 10, 2);
    expect(rangeMiddle).toEqual(3);
  });

  it('should calculate page range correctly (calculateEndPage)', () => {
    const rangeMiddle = component['calculateEndPage'](5, 10, 2);
    expect(rangeMiddle).toEqual(7);
  });

  it('should calculate page range correctly (calculateStartPage)', () => {
    const rangeMiddle = component['calculateStartPage'](2, 10, 2);
    expect(rangeMiddle).toEqual(1);
  });

  it('should calculate page range correctly (calculateEndPage)', () => {
    const rangeMiddle = component['calculateEndPage'](2, 10, 2);
    expect(rangeMiddle).toEqual(5);
  });

  it('should calculate page range correctly (calculateStartPage)', () => {
    const rangeMiddle = component['calculateStartPage'](9, 10, 2);
    expect(rangeMiddle).toEqual(6);
  });

  it('should calculate page range correctly (calculateEndPage)', () => {
    const rangeMiddle = component['calculateEndPage'](9, 10, 2);
    expect(rangeMiddle).toEqual(10);
  });

  it('should generate a sequence of page numbers (generatePageNumbers)', () => {
    const pages = component['generatePageNumbers'](3, 7);
    expect(pages).toEqual([3, 4, 5, 6, 7]);
  });
});
