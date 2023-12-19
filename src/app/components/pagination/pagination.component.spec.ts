import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  const currentPageElipseMap = new Map<number, (string | number)[]>([
    [1, [1, 2, '...', 100]],
    [2, [1, 2, 3, '...', 100]],
    [3, [1, 2, 3, 4, '...', 100]],
    [4, [1, 2, 3, 4, 5, '...', 100]],
    [5, [1, '...', 4, 5, 6, '...', 100]],
    [97, [1, '...', 96, 97, 98, '...', 100]],
    [98, [1, '...', 97, 98, 99, 100]],
    [99, [1, '...', 98, 99, 100]],
    [100, [1, '...', 99, 100]],
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent],
    });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ellipsis skipped pages based on current page', () => {
    component.limit = 10;
    component.total = 1000;
    currentPageElipseMap.forEach((value: (string | number)[], key: number) => {
      component.currentPage = key;
      component.ngOnChanges();
      expect(component.elipsedPages).toEqual(value);
    });
  });

  it('should emit pageChange event on click', () => {
    spyOn(component.changePage, 'emit');
    component.limit = 10;
    component.total = 1000;

    component.ngOnChanges();
    fixture.detectChanges();

    const pagerButton = fixture.debugElement.query(By.css('[data-test-page-button]')).nativeElement;

    pagerButton.click();

    expect(component.changePage.emit).toHaveBeenCalledWith(1);
  });
});
