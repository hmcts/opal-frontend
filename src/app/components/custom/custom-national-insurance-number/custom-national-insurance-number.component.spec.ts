import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNationalInsuranceNumberComponent } from './custom-national-insurance-number.component';
import { FormGroup, FormControl } from '@angular/forms';

describe('CustomNationalInsuranceNumberComponent', () => {
  let component: CustomNationalInsuranceNumberComponent;
  let fixture: ComponentFixture<CustomNationalInsuranceNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomNationalInsuranceNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomNationalInsuranceNumberComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      nationalInsuranceNumber: new FormControl(null),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
