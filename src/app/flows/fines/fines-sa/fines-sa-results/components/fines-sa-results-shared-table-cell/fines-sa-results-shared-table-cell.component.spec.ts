import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FinesNotProvidedComponent } from '../../../../components/fines-not-provided/fines-not-provided.component';
import { FinesSaResultsSharedTableCellComponent } from './fines-sa-results-shared-table-cell.component';
import { FinesSaResultsSharedTableCellType } from './types/fines-sa-results-shared-table-cell.type';

describe('FinesSaResultsSharedTableCellComponent', () => {
  let component: FinesSaResultsSharedTableCellComponent;
  let fixture: ComponentFixture<FinesSaResultsSharedTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsSharedTableCellComponent, FinesNotProvidedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsSharedTableCellComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template behavior with different values', () => {
    it('should show not provided component when value is null', () => {
      // Arrange
      component.value = null;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeTruthy();
    });

    it('should show not provided component when value is undefined', () => {
      // Arrange
      component.value = undefined;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeTruthy();
    });

    it('should show not provided component when value is an empty array', () => {
      // Arrange
      component.value = [];

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeTruthy();
    });

    it('should show content when value is a non-empty string', () => {
      // Arrange
      component.value = 'test value';

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should show content when value is a number', () => {
      // Arrange
      component.value = 42;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should show content when value is zero', () => {
      // Arrange
      component.value = 0;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should show content when value is an empty string', () => {
      // Arrange
      component.value = '';

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should show content when value is a non-empty array', () => {
      // Arrange
      component.value = ['item1', 'item2'];

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });
  });

  describe('Template rendering', () => {
    it('should show FinesNotProvidedComponent when value is null', () => {
      // Arrange
      component.value = null;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeTruthy();
    });

    it('should show FinesNotProvidedComponent when value is undefined', () => {
      // Arrange
      component.value = undefined;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeTruthy();
    });

    it('should show FinesNotProvidedComponent when value is empty array', () => {
      // Arrange
      component.value = [];

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeTruthy();
    });

    it('should show content projection when value is provided', () => {
      // Arrange
      component.value = 'test content';

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should not show FinesNotProvidedComponent when value is empty string', () => {
      // Arrange
      component.value = '';

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should not show FinesNotProvidedComponent when value is zero', () => {
      // Arrange
      component.value = 0;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });

    it('should not show FinesNotProvidedComponent when value is false', () => {
      // Arrange
      component.value = false;

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });
  });

  describe('Content projection', () => {
    it('should project content when value is valid', () => {
      // Arrange
      component.value = 'valid value';

      // Act
      fixture.detectChanges();

      // Assert
      const notProvidedElement = fixture.debugElement.query(By.directive(FinesNotProvidedComponent));
      expect(notProvidedElement).toBeNull();
    });
  });

  describe('Component initialization', () => {
    it('should initialize properly', () => {
      expect(component).toBeTruthy();
      expect(component.value).toBeUndefined();
    });
  });

  describe('Type safety', () => {
    it('should accept string values', () => {
      // Arrange & Act
      const stringValue: FinesSaResultsSharedTableCellType = 'test string';
      component.value = stringValue;

      // Assert
      expect(component.value).toBe('test string');
    });

    it('should accept number values', () => {
      // Arrange & Act
      const numberValue: FinesSaResultsSharedTableCellType = 42;
      component.value = numberValue;

      // Assert
      expect(component.value).toBe(42);
    });

    it('should accept boolean values', () => {
      // Arrange & Act
      const booleanValue: FinesSaResultsSharedTableCellType = true;
      component.value = booleanValue;

      // Assert
      expect(component.value).toBe(true);
    });

    it('should accept string array values', () => {
      // Arrange & Act
      const arrayValue: FinesSaResultsSharedTableCellType = ['item1', 'item2'];
      component.value = arrayValue;

      // Assert
      expect(component.value).toEqual(['item1', 'item2']);
    });

    it('should accept null values', () => {
      // Arrange & Act
      const nullValue: FinesSaResultsSharedTableCellType = null;
      component.value = nullValue;

      // Assert
      expect(component.value).toBe(null);
    });

    it('should accept undefined values', () => {
      // Arrange & Act
      const undefinedValue: FinesSaResultsSharedTableCellType = undefined;
      component.value = undefinedValue;

      // Assert
      expect(component.value).toBe(undefined);
    });
  });
});
