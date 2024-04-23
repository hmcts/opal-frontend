import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphagovAccessibleAutocompleteComponent } from './alphagov-accessible-autocomplete.component';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';
import { AUTO_COMPLETE_ITEMS_MOCK } from '@mocks';
import { FormControl, Validators } from '@angular/forms';

describe('AlphagovAccessibleAutocompleteComponent', () => {
  let component: AlphagovAccessibleAutocompleteComponent;
  let fixture: ComponentFixture<AlphagovAccessibleAutocompleteComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphagovAccessibleAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlphagovAccessibleAutocompleteComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null, [Validators.required]);

    component.labelText = 'Test';
    component.labelClasses = 'test';
    component.inputName = 'test';
    component.inputId = 'test';
    component.inputClasses = 'test';
    component.autoCompleteItems = AUTO_COMPLETE_ITEMS_MOCK;
    component.control = formControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build autocomplete props correctly', () => {
    const expectedProps: AccessibleAutocompleteProps = {
      id: component.autoCompleteId,
      element: component.autocompleteContainer.nativeElement,
      source: component.autoCompleteItems.map((item) => item.name),
      name: component.autoCompleteId,
      showAllValues: component.showAllValues,
      defaultValue: component['_control'].value || '',
      onConfirm: (selectedName: string) => component['handleOnConfirm'](selectedName),
    };

    const actualProps = component['buildAutoCompleteProps']();

    expect(actualProps.id).toEqual(expectedProps.id);
    expect(actualProps.element).toEqual(expectedProps.element);
    expect(actualProps.source).toEqual(expectedProps.source);
    expect(actualProps.name).toEqual(expectedProps.name);
    expect(actualProps.showAllValues).toEqual(expectedProps.showAllValues);
    expect(actualProps.defaultValue).toEqual(expectedProps.defaultValue);
  });

  it('should handle on confirm', () => {
    const selectedName = 'Test Option';
    const inputValue = 'Test Input';
    const selectedItem = { name: selectedName, value: 'Test Value' };
    const previousValue = null;

    // Mock document.querySelector
    const mockInputElement = document.createElement('input');
    mockInputElement.value = inputValue;
    spyOn(document, 'querySelector').and.returnValue(mockInputElement);
    spyOn(component['changeDetector'], 'detectChanges');

    component.autoCompleteItems = [{ name: 'Option 1', value: 'Value 1' }, selectedItem];
    component['_control'] = new FormControl(previousValue);

    component['handleOnConfirm'](selectedName);

    expect(component['_control'].value).toEqual(selectedItem.value);
    expect(component['_control'].touched).toBeTrue();

    if (selectedItem === null && previousValue === null) {
      expect(component['_control'].pristine).toBeTrue();
    } else if (selectedItem?.value !== previousValue) {
      expect(component['_control'].dirty).toBeTrue();
    }

    expect(component['_control'].valid).toBeTrue();
    expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
  });

  it('should get the control', () => {
    const result = component.getControl;

    expect(result).toEqual(component['_control']);
  });
});
