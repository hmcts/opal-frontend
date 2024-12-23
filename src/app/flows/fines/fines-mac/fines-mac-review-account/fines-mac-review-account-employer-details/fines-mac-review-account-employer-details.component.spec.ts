import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountEmployerDetailsComponent } from './fines-mac-review-account-employer-details.component';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';

describe('FinesMacReviewAccountEmployerDetailsComponent', () => {
  let component: FinesMacReviewAccountEmployerDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountEmployerDetailsComponent> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountEmployerDetailsComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountEmployerDetailsComponent);
    component = fixture.componentInstance;

    component.employerDetails = structuredClone(FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK);

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockUtilsService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format employer address on initialization', () => {
    if (!component || !mockUtilsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const formattedAddress = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5', 'Post Code'];
    mockUtilsService.formatAddress.and.returnValue(formattedAddress);

    component['getEmployerAddressData']();

    expect(mockUtilsService.formatAddress).toHaveBeenCalledWith([
      component.employerDetails.fm_employer_details_employer_address_line_1,
      component.employerDetails.fm_employer_details_employer_address_line_2,
      component.employerDetails.fm_employer_details_employer_address_line_3,
      component.employerDetails.fm_employer_details_employer_address_line_4,
      component.employerDetails.fm_employer_details_employer_address_line_5,
      component.employerDetails.fm_employer_details_employer_post_code,
    ]);
    expect(component.employerAddress).toBe(formattedAddress);
  });

  it('should emit change employer details event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeEmployerDetails, 'emit');

    component.changeEmployerDetails();

    expect(component.emitChangeEmployerDetails.emit).toHaveBeenCalled();
  });

  it('should call getEmployerDetailsData on init', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getEmployerDetailsData');

    component.ngOnInit();

    expect(component['getEmployerDetailsData']).toHaveBeenCalled();
  });
});
