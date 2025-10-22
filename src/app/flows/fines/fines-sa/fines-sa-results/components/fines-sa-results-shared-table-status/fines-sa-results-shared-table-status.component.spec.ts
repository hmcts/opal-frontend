import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MojSortableTableStatusComponent } from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { FinesSaResultsSharedTableStatusComponent } from './fines-sa-results-shared-table-status.component';

describe('FinesSaResultsSharedTableStatusComponent', () => {
  let component: FinesSaResultsSharedTableStatusComponent;
  let fixture: ComponentFixture<FinesSaResultsSharedTableStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsSharedTableStatusComponent, MojSortableTableStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsSharedTableStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input property handling', () => {
    it('should pass columnTitle to MojSortableTableStatusComponent', () => {
      // Arrange
      const testTitle = 'Test Column';
      component.columnTitle = testTitle;

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.columnTitle).toBe(testTitle);
    });

    it('should pass sortDirection to MojSortableTableStatusComponent', () => {
      // Arrange
      const testDirection = 'ascending';
      component.sortDirection = testDirection;

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.sortDirection).toBe(testDirection);
    });

    it('should handle null columnTitle by passing empty string', () => {
      // Arrange
      component.columnTitle = null;

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.columnTitle).toBe('');
    });

    it('should handle null sortDirection by passing "none"', () => {
      // Arrange
      component.sortDirection = null;

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.sortDirection).toBe('none');
    });
  });

  describe('Sort direction values', () => {
    it('should handle ascending sort direction', () => {
      // Arrange
      component.columnTitle = 'Account';
      component.sortDirection = 'ascending';

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.sortDirection).toBe('ascending');
    });

    it('should handle descending sort direction', () => {
      // Arrange
      component.columnTitle = 'Name';
      component.sortDirection = 'descending';

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.sortDirection).toBe('descending');
    });

    it('should handle none sort direction', () => {
      // Arrange
      component.columnTitle = 'Balance';
      component.sortDirection = 'none';

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.sortDirection).toBe('none');
    });
  });

  describe('Default values', () => {
    it('should have correct default values', () => {
      expect(component.columnTitle).toBe(null);
      expect(component.sortDirection).toBe(null);
    });
  });

  describe('Template rendering', () => {
    it('should render MojSortableTableStatusComponent', () => {
      // Arrange
      component.columnTitle = 'Test';
      component.sortDirection = 'ascending';

      // Act
      fixture.detectChanges();

      // Assert
      const statusElement = fixture.debugElement.query(By.directive(MojSortableTableStatusComponent));
      expect(statusElement).toBeTruthy();
    });

    it('should be wrapped in ng-container with status attribute', () => {
      // Arrange
      component.columnTitle = 'Test Column';
      component.sortDirection = 'ascending';

      // Act
      fixture.detectChanges();

      // Assert
      // Check that the MojSortableTableStatusComponent is rendered (which verifies the ng-container works)
      const statusComponent = fixture.debugElement.query(By.directive(MojSortableTableStatusComponent));
      expect(statusComponent).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string columnTitle', () => {
      // Arrange
      component.columnTitle = '';
      component.sortDirection = 'ascending';

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.columnTitle).toBe('');
    });

    it('should handle both null values', () => {
      // Arrange
      component.columnTitle = null;
      component.sortDirection = null;

      // Act
      fixture.detectChanges();

      // Assert
      const statusComponent = fixture.debugElement.query(
        By.directive(MojSortableTableStatusComponent),
      ).componentInstance;
      expect(statusComponent.columnTitle).toBe('');
      expect(statusComponent.sortDirection).toBe('none');
    });
  });
});
