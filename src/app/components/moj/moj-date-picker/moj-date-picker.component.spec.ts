import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MojDatePickerComponent } from './moj-date-picker.component';
import { FormControl } from '@angular/forms';

describe('MojDatePickerComponent', () => {
  let component: MojDatePickerComponent;
  let fixture: ComponentFixture<MojDatePickerComponent>;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojDatePickerComponent);
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

  it('should update selectedDate and emit dateChange event when changeDate is called - incorrect date', () => {
    spyOn(component.dateChange, 'emit');
    const newDate = '32/13/2024';

    component['setDateValue'](newDate);

    expect(component.dateChange.emit).toHaveBeenCalledWith(newDate);
  });

  it('should test concatenateDisabledDates when supplied', () => {
    component.disabledDates = ['01/01/2024', '01/02/2024'];

    component.ngOnInit();

    expect(component.disabledDatesConcatenated).toEqual('01/01/2024 01/02/2024');
  });
});
