import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacVehicleDetailsComponent } from './fines-mac-vehicle-details.component';
import { FINES_MAC_VEHICLE_DETAILS_FIELD_IDS } from './constants';
import { FormGroup, FormControl } from '@angular/forms';

describe('FinesMacVehicleDetailsComponent', () => {
  let component: FinesMacVehicleDetailsComponent;
  let fixture: ComponentFixture<FinesMacVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacVehicleDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacVehicleDetailsComponent);
    component = fixture.componentInstance;

    component.legendText = 'Test';
    component.form = new FormGroup({
      VehicleMake: new FormControl(null),
      VehicleRegistrationMark: new FormControl(null),
    });
    component.formControlErrorMessages = {};
    component.vehicleDetailsFieldIds = FINES_MAC_VEHICLE_DETAILS_FIELD_IDS;
    component.componentName = 'testComponent';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
