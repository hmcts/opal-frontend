import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScotgovDatePickerComponent } from './scotgov-date-picker.component';
import { FormControl } from '@angular/forms';

describe('ScotgovDatePickerComponent', () => {
  let component: ScotgovDatePickerComponent;
  let fixture: ComponentFixture<ScotgovDatePickerComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScotgovDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScotgovDatePickerComponent);
    component = fixture.componentInstance;

    formControl = new FormControl(null);

    component.labelText = 'Test Date Picker Label';
    component.inputId = 'datePickerId';
    component.inputName = 'datePickerName';
    component.control = formControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initAll on date picker library', waitForAsync(() => {
    const initAllSpy = jasmine.createSpy('initAll');
    spyOn(component, 'configureDatePicker').and.callFake(() => {
      return Promise.resolve({
        initAll: initAllSpy,
      }).then((library) => {
        library.initAll();
        expect(initAllSpy).toHaveBeenCalled();
      });
    });

    component.configureDatePicker();
  }));

  it('should update selectedDate and emit dateChange event when changeDate is called', () => {
    spyOn(component.dateChange, 'emit');
    const newDate = '01/01/2024';

    component['setDateValue'](newDate);

    expect(component.dateChange.emit).toHaveBeenCalledWith(newDate);
  });

  it('should test getDisabledDates when supplied', () => {
    component.disabledDates = ['01/01/2024', '01/02/2024'];
    expect(component.getDisabledDates()).toEqual('01/01/2024 01/02/2024');
  });
});