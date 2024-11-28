import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountEmployerDetailsComponent } from './fines-mac-review-account-employer-details.component';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK } from '../../fines-mac-employer-details/mocks/fines-mac-employer-details-state.mock';

describe('FinesMacReviewAccountEmployerDetailsComponent', () => {
  let component: FinesMacReviewAccountEmployerDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountEmployerDetailsComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountEmployerDetailsComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountEmployerDetailsComponent);
    component = fixture.componentInstance;

    component.employerDetails = { ...FINES_MAC_EMPLOYER_DETAILS_STATE_MOCK };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format employer address on initialization', () => {
    const formattedAddress = 'Line 1<br>Line 2<br>Line 3<br>Line 4<br>Line 5<br>Post Code';
    mockUtilsService.formatAddress.and.returnValue(formattedAddress);

    component['getEmployerAddressData']();

    expect(mockUtilsService.formatAddress).toHaveBeenCalledWith(
      [
        component.employerDetails.fm_employer_details_employer_address_line_1,
        component.employerDetails.fm_employer_details_employer_address_line_2,
        component.employerDetails.fm_employer_details_employer_address_line_3,
        component.employerDetails.fm_employer_details_employer_address_line_4,
        component.employerDetails.fm_employer_details_employer_address_line_5,
        component.employerDetails.fm_employer_details_employer_post_code,
      ],
      '<br>',
    );
    expect(component.employerAddress).toBe(formattedAddress);
  });

  it('should emit change employer details event', () => {
    spyOn(component.emitChangeEmployerDetails, 'emit');

    component.changeEmployerDetails();

    expect(component.emitChangeEmployerDetails.emit).toHaveBeenCalled();
  });

  it('should call getEmployerDetailsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getEmployerDetailsData');

    component.ngOnInit();

    expect(component['getEmployerDetailsData']).toHaveBeenCalled();
  });
});
