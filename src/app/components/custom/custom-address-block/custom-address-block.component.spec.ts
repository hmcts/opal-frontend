import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomAddressBlockComponent } from './custom-address-block.component';
import { CUSTOM_ADDRESS_FIELD_IDS } from '@constants/components/custom';

describe('CustomAddressBlockComponent', () => {
  let component: CustomAddressBlockComponent;
  let fixture: ComponentFixture<CustomAddressBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAddressBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAddressBlockComponent);
    component = fixture.componentInstance;

    component.legendText = 'Test';
    component.form = new FormGroup({
      AddressLine1: new FormControl(null),
      AddressLine2: new FormControl(null),
      AddressLine3: new FormControl(null),
      Postcode: new FormControl(null),
    });
    component.formControlErrorMessages = {};
    component.addressFieldIds = CUSTOM_ADDRESS_FIELD_IDS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend labelText', () => {
    const elem = fixture.debugElement.query(By.css('.govuk-fieldset__legend.govuk-fieldset__legend--m')).nativeElement;
    expect(elem.textContent).toContain('Test');
  });
});
