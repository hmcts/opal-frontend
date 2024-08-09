import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomDateOfBirthComponent } from './custom-date-of-birth.component';
import { FormGroup, FormControl } from '@angular/forms';

describe('CustomDateOfBirthComponent', () => {
  let component: CustomDateOfBirthComponent;
  let fixture: ComponentFixture<CustomDateOfBirthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateOfBirthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDateOfBirthComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      DOB: new FormControl(null),
    });
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
