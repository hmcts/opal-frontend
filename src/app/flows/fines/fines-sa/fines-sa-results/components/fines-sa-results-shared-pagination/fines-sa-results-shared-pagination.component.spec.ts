import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';
import { FinesSaResultsSharedPaginationComponent } from './fines-sa-results-shared-pagination.component';

describe('FinesSaResultsSharedPaginationComponent', () => {
  let component: FinesSaResultsSharedPaginationComponent;
  let fixture: ComponentFixture<FinesSaResultsSharedPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsSharedPaginationComponent, MojPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsSharedPaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pagination visibility', () => {
    it('should show pagination when totalItems > currentPageItems', () => {
      // Arrange
      component.totalItems = 100;
      component.currentPageItems = 25;
      component.paginationId = 'test-pagination';
      component.currentPage = 1;
      component.itemsPerPage = 25;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationElement = fixture.debugElement.query(By.css('opal-lib-moj-pagination'));
      expect(paginationElement).toBeTruthy();
    });

    it('should hide pagination when totalItems <= currentPageItems', () => {
      // Arrange
      component.totalItems = 25;
      component.currentPageItems = 25;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationElement = fixture.debugElement.query(By.css('opal-lib-moj-pagination'));
      expect(paginationElement).toBeNull();
    });

    it('should hide pagination when totalItems < currentPageItems', () => {
      // Arrange
      component.totalItems = 10;
      component.currentPageItems = 25;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationElement = fixture.debugElement.query(By.css('opal-lib-moj-pagination'));
      expect(paginationElement).toBeNull();
    });
  });

  describe('Input properties', () => {
    beforeEach(() => {
      // Set baseline values to ensure pagination is visible but don't call detectChanges yet
      component.totalItems = 100;
      component.currentPageItems = 25;
      component.paginationId = 'test-pagination';
      component.currentPage = 1;
      component.itemsPerPage = 25;
    });

    it('should pass paginationId to pagination component', () => {
      // Arrange
      const testId = 'custom-pagination-id';
      component.paginationId = testId;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationComponent = fixture.debugElement.query(By.directive(MojPaginationComponent)).componentInstance;
      expect(paginationComponent.id).toBe(testId);
    });

    it('should pass currentPage to pagination component', () => {
      // Arrange
      const testPage = 3;
      component.currentPage = testPage;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationComponent = fixture.debugElement.query(By.directive(MojPaginationComponent)).componentInstance;
      expect(paginationComponent.currentPage).toBe(testPage);
    });

    it('should pass itemsPerPage to pagination component as limit', () => {
      // Arrange
      const testLimit = 50;
      component.itemsPerPage = testLimit;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationComponent = fixture.debugElement.query(By.directive(MojPaginationComponent)).componentInstance;
      expect(paginationComponent.limit).toBe(testLimit);
    });

    it('should pass totalItems to pagination component as total', () => {
      // Arrange
      const testTotal = 150;
      component.totalItems = testTotal;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationComponent = fixture.debugElement.query(By.directive(MojPaginationComponent)).componentInstance;
      expect(paginationComponent.total).toBe(testTotal);
    });
  });

  describe('Event handling', () => {
    beforeEach(() => {
      component.totalItems = 100;
      component.currentPageItems = 25;
      fixture.detectChanges();
    });

    it('should emit changePage event when pagination component emits changePage', () => {
      // Arrange
      spyOn(component.changePage, 'emit');
      const paginationComponent = fixture.debugElement.query(By.directive(MojPaginationComponent)).componentInstance;
      const testPage = 2;

      // Act
      paginationComponent.changePage.emit(testPage);

      // Assert
      expect(component.changePage.emit).toHaveBeenCalledWith(testPage);
    });

    it('should call onPageChange method when pagination emits changePage', () => {
      // Arrange
      spyOn(component, 'onPageChange');
      const paginationComponent = fixture.debugElement.query(By.directive(MojPaginationComponent)).componentInstance;
      const testPage = 4;

      // Act
      paginationComponent.changePage.emit(testPage);

      // Assert
      expect(component.onPageChange).toHaveBeenCalledWith(testPage);
    });
  });

  describe('Default values', () => {
    it('should have correct default values', () => {
      expect(component.paginationId).toBe('fines-draft-table-pagination');
      expect(component.currentPage).toBe(1);
      expect(component.itemsPerPage).toBe(25);
      expect(component.totalItems).toBe(0);
      expect(component.currentPageItems).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero totalItems', () => {
      // Arrange
      component.totalItems = 0;
      component.currentPageItems = 0;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationElement = fixture.debugElement.query(By.css('opal-lib-moj-pagination'));
      expect(paginationElement).toBeNull();
    });

    it('should handle negative values gracefully', () => {
      // Arrange
      component.totalItems = -1;
      component.currentPageItems = 25;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationElement = fixture.debugElement.query(By.css('opal-lib-moj-pagination'));
      expect(paginationElement).toBeNull();
    });

    it('should show pagination when totalItems equals currentPageItems + 1', () => {
      // Arrange
      component.totalItems = 26;
      component.currentPageItems = 25;

      // Act
      fixture.detectChanges();

      // Assert
      const paginationElement = fixture.debugElement.query(By.css('opal-lib-moj-pagination'));
      expect(paginationElement).toBeTruthy();
    });
  });
});
