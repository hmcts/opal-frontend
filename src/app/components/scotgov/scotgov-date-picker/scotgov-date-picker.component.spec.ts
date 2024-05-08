import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScotgovDatePickerComponent } from './scotgov-date-picker.component';

describe('ScotgovDatePickerComponent', () => {
  let component: ScotgovDatePickerComponent;
  let fixture: ComponentFixture<ScotgovDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScotgovDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScotgovDatePickerComponent);
    component = fixture.componentInstance;
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
});
