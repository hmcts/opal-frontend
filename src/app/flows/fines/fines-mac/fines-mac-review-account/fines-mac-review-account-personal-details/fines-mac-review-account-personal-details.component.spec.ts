import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountPersonalDetailsComponent } from './fines-mac-review-account-personal-details.component';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { DateTime } from 'luxon';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj';

describe('FinesMacReviewAccountPersonalDetailsComponent', () => {
  let component: FinesMacReviewAccountPersonalDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountPersonalDetailsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;

  beforeEach(async () => {
    mockDateService = createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
    mockUtilsService = createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountPersonalDetailsComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountPersonalDetailsComponent);
    component = fixture.componentInstance;

    component.personalDetails = structuredClone(FINES_MAC_PERSONAL_DETAILS_STATE_MOCK);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format aliases correctly', () => {
    component.personalDetails.fm_personal_details_aliases = [
      ...component.personalDetails.fm_personal_details_aliases,
      { fm_personal_details_alias_forenames_1: 'James', fm_personal_details_alias_surname_1: 'Smith' },
      { fm_personal_details_alias_forenames_2: 'Emily', fm_personal_details_alias_surname_2: 'Johnston' },
      { fm_personal_details_alias_forenames_3: 'Oliver', fm_personal_details_alias_surname_4: 'Brown' },
      { fm_personal_details_alias_forenames_4: 'Sophia', fm_personal_details_alias_surname_4: 'Taylor' },
    ];

    component['getAliasesData']();

    expect(component.aliases).toEqual([
      'Testing TEST',
      'James Smith',
      'Emily Johnston',
      'Oliver Brown',
      'Sophia Taylor',
    ]);
  });

  it('should format date of birth correctly - adult', () => {
    mockDateService.calculateAge.mockReturnValue(34);
    mockDateService.getFromFormatToFormat.mockReturnValue('01 January 1990');

    component['getDateOfBirthData']();

    expect(component.dob).toBe('01 January 1990 (Adult)');
  });

  it('should format date of birth correctly - youth', () => {
    const mockDob = DateTime.now().minus({ years: 10 });

    component.personalDetails = {
      ...component.personalDetails,
      fm_personal_details_dob: mockDob.toFormat('dd/MM/yyyy'),
    };

    mockDateService.calculateAge.mockReturnValue(10);
    mockDateService.getFromFormatToFormat.mockReturnValue(mockDob.toFormat('dd MMMM yyyy'));

    component['getDateOfBirthData']();

    expect(component.dob).toBe(`${mockDob.toFormat('dd MMMM yyyy')} (Youth)`);
  });

  it('should format address correctly', () => {
    const formattedAddress = ['123 Main St', 'Apt 4B', 'Springfield', '12345'];
    mockUtilsService.formatAddress.mockReturnValue(formattedAddress);

    component['getAddressData']();

    expect(mockUtilsService.formatAddress).toHaveBeenCalledWith([
      component.personalDetails.fm_personal_details_address_line_1,
      component.personalDetails.fm_personal_details_address_line_2,
      component.personalDetails.fm_personal_details_address_line_3,
      component.personalDetails.fm_personal_details_post_code,
    ]);
    expect(component.address).toBe(formattedAddress);
  });

  it('should emit change personal details event', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangePersonalDetails, 'emit');

    component.changePersonalDetails();

    expect(component.emitChangePersonalDetails.emit).toHaveBeenCalled();
  });

  it('should call getPersonalDetailsData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getPersonalDetailsData');

    component.ngOnInit();

    expect(component['getPersonalDetailsData']).toHaveBeenCalled();
  });
});
