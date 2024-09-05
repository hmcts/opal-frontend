import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacDateOfBirthComponent } from './fines-mac-date-of-birth.component';
import { FormGroup, FormControl } from '@angular/forms';
import { DateService } from '@services';

describe('FinesMacDateOfBirthComponent', () => {
  let component: FinesMacDateOfBirthComponent;
  let fixture: ComponentFixture<FinesMacDateOfBirthComponent>;

  beforeEach(async () => {
    const dateServiceSpy = jasmine.createSpyObj('DateService', ['getPreviousDate']);

    await TestBed.configureTestingModule({
      imports: [FinesMacDateOfBirthComponent],
      providers: [{ provide: DateService, useValue: dateServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacDateOfBirthComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      dob: new FormControl(null),
    });
    component.componentName = 'testComponent';
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit date change', () => {
    const date = '2022-01-01';
    spyOn(component.dateChange, 'emit');

    component.emitDateChange(date);

    expect(component.dateChange.emit).toHaveBeenCalledWith(date);
  });
});
