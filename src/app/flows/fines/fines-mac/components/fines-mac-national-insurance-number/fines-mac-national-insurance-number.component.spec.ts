import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacNationalInsuranceNumberComponent } from './fines-mac-national-insurance-number.component';
import { FormGroup, FormControl } from '@angular/forms';

describe('FinesMacNationalInsuranceNumberComponent', () => {
  let component: FinesMacNationalInsuranceNumberComponent;
  let fixture: ComponentFixture<FinesMacNationalInsuranceNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacNationalInsuranceNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacNationalInsuranceNumberComponent);
    component = fixture.componentInstance;

    component.form = new FormGroup({
      NationalInsuranceNumber: new FormControl(null),
    });
    component.formControlErrorMessages = {};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});