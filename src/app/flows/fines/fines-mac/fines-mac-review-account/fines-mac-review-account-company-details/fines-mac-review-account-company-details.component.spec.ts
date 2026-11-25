import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountCompanyDetailsComponent } from './fines-mac-review-account-company-details.component';
import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj.helper';

describe('FinesMacReviewAccountCompanyDetailsComponent', () => {
  let component: FinesMacReviewAccountCompanyDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountCompanyDetailsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;

  beforeEach(async () => {
    mockUtilsService = createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountCompanyDetailsComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountCompanyDetailsComponent);
    component = fixture.componentInstance;

    component.companyDetails = structuredClone(FINES_MAC_COMPANY_DETAILS_STATE_MOCK);
    fixture.componentRef.setInput('release1a1_3Enabled', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format aliases correctly', () => {
    component.companyDetails.fm_company_details_aliases = [
      ...component.companyDetails.fm_company_details_aliases,
      { fm_company_details_alias_company_name_1: 'Alpha Solutions Ltd' },
      { fm_company_details_alias_company_name_2: 'Beta Innovations Corp' },
      { fm_company_details_alias_company_name_3: 'Gamma Enterprises Inc' },
      { fm_company_details_alias_company_name_4: 'Delta Systems Group' },
    ];

    component['getAliasesData']();

    expect(component.aliases).toEqual([
      'BORING CO LTD.',
      'Alpha Solutions Ltd',
      'Beta Innovations Corp',
      'Gamma Enterprises Inc',
      'Delta Systems Group',
    ]);
  });

  it('should format address correctly', () => {
    const formattedAddress = ['123 Main St', 'Apt 4B', 'Springfield', '12345'];
    mockUtilsService.formatAddress.mockReturnValue(formattedAddress);

    component['getAddressData']();

    expect(mockUtilsService.formatAddress).toHaveBeenCalledWith([
      component.companyDetails.fm_company_details_address_line_1,
      component.companyDetails.fm_company_details_address_line_2,
      component.companyDetails.fm_company_details_address_line_3,
      component.companyDetails.fm_company_details_postcode,
    ]);
    expect(component.address).toBe(formattedAddress);
  });

  it('should emit change company details event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangeCompanyDetails, 'emit');

    component.changeCompanyDetails();

    expect(component.emitChangeCompanyDetails.emit).toHaveBeenCalled();
  });

  it('should call getCompanyData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getCompanyData');

    component.ngOnInit();

    expect(component['getCompanyData']).toHaveBeenCalled();
  });

  describe('Company vehicle details', () => {
    it('should display vehicle make and registration number', () => {
      const nativeElement = fixture.nativeElement as HTMLElement;

      expect(nativeElement.textContent).toContain('Vehicle make and model');
      expect(nativeElement.textContent).toContain('Ford Transit');
      expect(nativeElement.textContent).toContain('Registration number');
      expect(nativeElement.textContent).toContain('AB12CDE');
    });

    it('should display a dash when vehicle details are not provided', () => {
      fixture.componentRef.setInput('companyDetails', {
        ...component.companyDetails,
        fm_company_details_vehicle_make: null,
        fm_company_details_vehicle_registration_mark: null,
      });

      fixture.detectChanges();

      const nativeElement = fixture.nativeElement as HTMLElement;

      const rows = Array.from(nativeElement.querySelectorAll('.govuk-summary-list__row'));

      const vehicleMakeRow = rows.find((row) => row.textContent?.includes('Vehicle make and model'));

      const registrationRow = rows.find((row) => row.textContent?.includes('Registration number'));

      expect(vehicleMakeRow).toBeDefined();
      expect(registrationRow).toBeDefined();

      expect(vehicleMakeRow?.textContent).toContain('—');
      expect(registrationRow?.textContent).toContain('—');
    });

    it('should display vehicle details in read-only mode', () => {
      component.isReadOnly = true;

      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const nativeElement = fixture.nativeElement as HTMLElement;

      expect(nativeElement.textContent).toContain('Ford Transit');
      expect(nativeElement.textContent).toContain('AB12CDE');
    });

    it('should hide vehicle details when release-1a-1-3 is disabled', () => {
      fixture.componentRef.setInput('release1a1_3Enabled', false);
      fixture.detectChanges();

      const rows = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.govuk-summary-list__row'));

      expect(rows.some((row) => row.textContent?.includes('Vehicle make and model'))).toBe(false);
      expect(rows.some((row) => row.textContent?.includes('Registration number'))).toBe(false);
    });
  });
});
