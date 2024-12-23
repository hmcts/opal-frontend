import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountCompanyDetailsComponent } from './fines-mac-review-account-company-details.component';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';

describe('FinesMacReviewAccountCompanyDetailsComponent', () => {
  let component: FinesMacReviewAccountCompanyDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountCompanyDetailsComponent> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountCompanyDetailsComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountCompanyDetailsComponent);
    component = fixture.componentInstance;

    component.companyDetails = structuredClone(FINES_MAC_COMPANY_DETAILS_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format aliases correctly', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.companyDetails.fm_company_details_aliases = [
      ...component.companyDetails.fm_company_details_aliases,
      { fm_company_details_alias_organisation_name_1: 'Alpha Solutions Ltd' },
      { fm_company_details_alias_organisation_name_2: 'Beta Innovations Corp' },
      { fm_company_details_alias_organisation_name_3: 'Gamma Enterprises Inc' },
      { fm_company_details_alias_organisation_name_4: 'Delta Systems Group' },
    ];

    component['getAliasesData']();

    expect(component.aliases).toEqual([
      'Boring Co.',
      'Alpha Solutions Ltd',
      'Beta Innovations Corp',
      'Gamma Enterprises Inc',
      'Delta Systems Group',
    ]);
  });

  it('should format address correctly', () => {
    if (!component || !mockUtilsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const formattedAddress = ['123 Main St', 'Apt 4B', 'Springfield', '12345'];
    mockUtilsService.formatAddress.and.returnValue(formattedAddress);

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
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeCompanyDetails, 'emit');

    component.changeCompanyDetails();

    expect(component.emitChangeCompanyDetails.emit).toHaveBeenCalled();
  });

  it('should call getCompanyData on init', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getCompanyData');

    component.ngOnInit();

    expect(component['getCompanyData']).toHaveBeenCalled();
  });
});
