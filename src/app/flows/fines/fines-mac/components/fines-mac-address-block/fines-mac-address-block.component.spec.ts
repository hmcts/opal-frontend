import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FinesMacAddressBlockComponent } from './fines-mac-address-block.component';
import { FINES_MAC_ADDRESS_FIELD_IDS } from '@constants/components/fine/mac';

describe('FinesMacAddressBlockComponent', () => {
  let component: FinesMacAddressBlockComponent;
  let fixture: ComponentFixture<FinesMacAddressBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMacAddressBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacAddressBlockComponent);
    component = fixture.componentInstance;

    component.legendText = 'Test';
    component.form = new FormGroup({
      AddressLine1: new FormControl(null),
      AddressLine2: new FormControl(null),
      AddressLine3: new FormControl(null),
      Postcode: new FormControl(null),
    });
    component.formControlErrorMessages = {};
    component.addressFieldIds = FINES_MAC_ADDRESS_FIELD_IDS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend labelText', () => {
    const elem = fixture.debugElement.query(By.css('.govuk-fieldset_legend.govuk-fieldset_legend--m')).nativeElement;
    expect(elem.textContent).toContain('Test');
  });
});
