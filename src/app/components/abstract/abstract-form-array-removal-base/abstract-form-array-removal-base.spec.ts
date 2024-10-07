import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AbstractFormArrayRemovalComponent } from './abstract-form-array-removal-base';
import { of } from 'rxjs';

class TestAbstractFormArrayRemovalComponent extends AbstractFormArrayRemovalComponent {
  constructor() {
    super();
  }
}

describe('AbstractFormArrayRemovalBase', () => {
  let component: TestAbstractFormArrayRemovalComponent;
  let fixture: ComponentFixture<TestAbstractFormArrayRemovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractFormArrayRemovalComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFormArrayRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve control value or default value when control does not exist', () => {
    const formArray = new FormArray([new FormGroup({ field: new FormControl('test') })]);
    const value = component['getFormArrayControlValue'](formArray, 'field', 0, 'default');
    expect(value).toBe('test');

    const missingValue = component['getFormArrayControlValue'](formArray, 'missingField', 0, 'default');
    expect(missingValue).toBe('default');
  });

  it('should remove control and renumber the remaining controls', () => {
    const formArray = new FormArray([
      new FormGroup({ field1: new FormControl('value1') }),
      new FormGroup({ field2: new FormControl('value2') }),
      new FormGroup({ field3: new FormControl('value3') }),
    ]);

    component['removeControlAndRenumber'](formArray, 1, ['field1', 'field2', 'field3'], 'dynamicField');

    expect(formArray.length).toBe(2);
  });

  it('should renumber the controls in a FormArray', () => {
    const formArray = new FormArray([
      new FormGroup({ field1: new FormControl('value1') }),
      new FormGroup({ field2: new FormControl('value2') }),
      new FormGroup({ field3: new FormControl('value3') }),
    ]);

    component['renumberControls'](formArray, 1, ['field1', 'field2', 'field3'], 'dynamicField');

    expect(formArray.length).toBe(3);
  });

  it('should update control keys in a form group', () => {
    const formGroup = new FormGroup({
      dynamicField_field1_1: new FormControl('value1'),
      dynamicField_field2_1: new FormControl('value2'),
      dynamicField_field3_1: new FormControl('value3'),
    });

    component['updateControlKeys'](formGroup, 0, ['field1', 'field2', 'field3'], 'dynamicField');

    // Ensure old controls are properly removed
    expect(formGroup.get('dynamicField_field1_1')).toBeFalsy();
    expect(formGroup.get('dynamicField_field2_1')).toBeFalsy();
    expect(formGroup.get('dynamicField_field3_1')).toBeFalsy();

    // Ensure new controls are added correctly
    expect(formGroup.get('dynamicField_field1_0')).toBeTruthy();
    expect(formGroup.get('dynamicField_field2_0')).toBeTruthy();
    expect(formGroup.get('dynamicField_field3_0')).toBeTruthy();
  });

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate to relative route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test', true);
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate to relative route with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
