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

  it('should handle on confirm and input should be marked as dirty', () => {
    const selectedName = AUTO_COMPLETE_ITEMS_MOCK[0].name;
    const inputValue = AUTO_COMPLETE_ITEMS_MOCK[0].name;
    const selectedItem = AUTO_COMPLETE_ITEMS_MOCK[0];

    // Mock document.querySelector
    const mockInputElement = document.createElement('input');
    mockInputElement.value = inputValue;
    spyOn(document, 'querySelector').and.returnValue(mockInputElement);
    spyOn(component['changeDetector'], 'detectChanges');

    component['_control'].reset();

    component['handleOnConfirm'](selectedName);

    expect(component['_control'].value).toEqual(selectedItem.value);
    expect(component['_control'].touched).toBeTrue();

    expect(component['_control'].pristine).not.toBeTrue();
    expect(component['_control'].dirty).toBeTrue();

    expect(component['_control'].valid).toBeTrue();
    expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
  });

  it('should handle on confirm and input should be marked as pristine', () => {
    const selectedName = undefined;
    const inputValue = '';
    const selectedItem = null;

    // Mock document.querySelector
    const mockInputElement = document.createElement('input');
    mockInputElement.value = inputValue;
    spyOn(document, 'querySelector').and.returnValue(mockInputElement);
    spyOn(component['changeDetector'], 'detectChanges');

    component['_control'].reset();

    component['handleOnConfirm'](selectedName);

    expect(component['_control'].value).toEqual(selectedItem);
    expect(component['_control'].touched).toBeTrue();
    expect(component['_control'].pristine).toBeTrue();
    expect(component['_control'].dirty).not.toBeTrue();

    expect(component['_control'].valid).not.toBeTrue();
    expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
  });

  it('should get the control', () => {
    const result = component.getControl;

    expect(result).toEqual(component['_control']);
  });

  it('should get the default value', () => {
    const controlValue = AUTO_COMPLETE_ITEMS_MOCK[0].value;
    const selectedItem = AUTO_COMPLETE_ITEMS_MOCK[0];

    component['_control'].setValue(controlValue);

    const result = component['getDefaultValue']();

    expect(result).toEqual(selectedItem.name);
  });

  it('should return an empty string if control value is falsy', () => {
    component['_control'].setValue(null);

    const result = component['getDefaultValue']();

    expect(result).toEqual('');
  });

  it('should return an empty string if control value does not match any item', () => {
    const controlValue = 'test';

    component['_control'].setValue(controlValue);

    const result = component['getDefaultValue']();

    expect(result).toEqual('');
  });

  it('should not clear the autocomplete as we have a value', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'configureAutoComplete');

    component['controlSub'].unsubscribe();
    component['setupControlSub']();
    component['_control'].setValue('Hello');

    expect(component['configureAutoComplete']).not.toHaveBeenCalled();
  });

  it('should clear autocomplete when control value changes to null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'configureAutoComplete');

    component['controlSub'].unsubscribe();

    component['setupControlSub']();

    component['_control'].setValue('Hello');
    component['_control'].setValue(null);

    expect(component['configureAutoComplete']).toHaveBeenCalled();
    expect(component['autocompleteContainer'].nativeElement.innerHTML).toEqual('');
  });

  it('should not do anything as we have no values', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'configureAutoComplete');

    component['controlSub'].unsubscribe();

    component['setupControlSub']();

    component['_control'].setValue(null);
    component['_control'].setValue(null);

    expect(component['configureAutoComplete']).not.toHaveBeenCalled();
  });

  interface PrivateFunctionsComponent {
    handleOnConfirm: (arg: string) => void;
  }

  it('it should test the onConfirm section of buildAutoCompleteProps', () => {
    const autoCompleteProps = component['buildAutoCompleteProps']();
    if (typeof autoCompleteProps.onConfirm === 'function') {
      const onConfirm = autoCompleteProps.onConfirm;

      spyOn(component as unknown as PrivateFunctionsComponent, 'handleOnConfirm').and.callThrough();

      onConfirm('france');

      expect(component['handleOnConfirm']).toHaveBeenCalledWith('france');
    } else {
      fail('onConfirm is not a function or is undefined');
    }
  });
});
