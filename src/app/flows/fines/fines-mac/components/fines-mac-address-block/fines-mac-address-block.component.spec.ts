import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FinesMacAddressBlockComponent } from './fines-mac-address-block.component';
import { FINES_MAC_ADDRESS_BLOCK_FIELD_IDS } from './constants';

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
      address_line_1: new FormControl(null),
      address_line_2: new FormControl(null),
      address_line_3: new FormControl(null),
      postcode: new FormControl(null),
    });
    component.formControlErrorMessages = {};
    component.addressFieldIds = FINES_MAC_ADDRESS_BLOCK_FIELD_IDS;
    component.componentName = 'testComponent';

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
