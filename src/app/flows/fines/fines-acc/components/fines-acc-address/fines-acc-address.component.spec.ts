import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpperCasePipe } from '@angular/common';
import { FinesAccAddressComponent } from './fines-acc-address.component';
import { IOpalFinesDefendantAccountAddress } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

describe('FinesAccAddressComponent', () => {
  let component: FinesAccAddressComponent;
  let fixture: ComponentFixture<FinesAccAddressComponent>;

  const mockAddress: IOpalFinesDefendantAccountAddress = {
    address_line_1: '123 Main Street',
    address_line_2: 'Apartment 4B',
    address_line_3: 'City Centre',
    address_line_4: 'Greater London',
    address_line_5: 'England',
    postcode: 'SW1A 1AA',
  };

  const mockMinimalAddress: IOpalFinesDefendantAccountAddress = {
    address_line_1: '456 Simple Road',
    address_line_2: null,
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    postcode: 'M1 1AA',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccAddressComponent, UpperCasePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.componentRef.setInput('address', mockAddress);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display address signal correctly', () => {
    fixture.componentRef.setInput('address', mockAddress);
    fixture.detectChanges();

    expect(component.address()).toEqual(mockAddress);
  });

  it('should render complete address with all lines', () => {
    fixture.componentRef.setInput('address', mockAddress);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addressText = compiled.textContent;

    expect(addressText).toContain('123 Main Street');
    expect(addressText).toContain('Apartment 4B');
    expect(addressText).toContain('City Centre');
    expect(addressText).toContain('Greater London');
    expect(addressText).toContain('England');
    expect(addressText).toContain('SW1A 1AA');
  });

  it('should render minimal address with only required fields', () => {
    fixture.componentRef.setInput('address', mockMinimalAddress);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addressText = compiled.textContent;

    expect(addressText).toContain('456 Simple Road');
    expect(addressText).toContain('M1 1AA');
    expect(addressText).not.toContain('null');
  });

  it('should uppercase the postcode', () => {
    const lowercaseAddress = {
      ...mockAddress,
      post_code: 'sw1a 1aa',
    };

    fixture.componentRef.setInput('address', lowercaseAddress);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('SW1A 1AA');
    expect(compiled.textContent).not.toContain('sw1a 1aa');
  });

  it('should handle address with mixed null and undefined optional fields', () => {
    const mixedAddress: IOpalFinesDefendantAccountAddress = {
      address_line_1: '789 Mixed Street',
      address_line_2: 'Floor 2',
      address_line_3: null,
      address_line_4: null,
      address_line_5: 'County',
      postcode: 'AB1 2CD',
    };

    fixture.componentRef.setInput('address', mixedAddress);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const addressText = compiled.textContent;

    expect(addressText).toContain('789 Mixed Street');
    expect(addressText).toContain('Floor 2');
    expect(addressText).toContain('County');
    expect(addressText).toContain('AB1 2CD');
    expect(addressText).not.toContain('null');
    expect(addressText).not.toContain('undefined');
  });

  it('should maintain proper structure with line breaks', () => {
    fixture.componentRef.setInput('address', mockAddress);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const brElements = compiled.querySelectorAll('br');

    // Should have br elements for address lines plus one for postcode
    expect(brElements.length).toBeGreaterThan(0);
  });
});
