import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountCompanyDetailsComponent } from './fines-mac-review-account-company-details.component';
import { FINES_MAC_COMPANY_DETAILS_STATE_MOCK } from '../../fines-mac-company-details/mocks/fines-mac-company-details-state.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

describe('FinesMacReviewAccountCompanyDetailsComponent', () => {
  let component: FinesMacReviewAccountCompanyDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountCompanyDetailsComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

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
    component.companyDetails.fm_company_details_aliases = [
      ...component.companyDetails.fm_company_details_aliases,
      { fm_company_details_alias_company_name_1: 'Alpha Solutions Ltd' },
      { fm_company_details_alias_company_name_2: 'Beta Innovations Corp' },
      { fm_company_details_alias_company_name_3: 'Gamma Enterprises Inc' },
      { fm_company_details_alias_company_name_4: 'Delta Systems Group' },
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
    spyOn(component.emitChangeCompanyDetails, 'emit');

    component.changeCompanyDetails();

    expect(component.emitChangeCompanyDetails.emit).toHaveBeenCalled();
  });

  it('should call getCompanyData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getCompanyData');

    component.ngOnInit();

    expect(component['getCompanyData']).toHaveBeenCalled();
  });
});
