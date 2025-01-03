import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountPersonalDetailsComponent } from './fines-mac-review-account-personal-details.component';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { DateTime } from 'luxon';

describe('FinesMacReviewAccountPersonalDetailsComponent', () => {
  let component: FinesMacReviewAccountPersonalDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountPersonalDetailsComponent> | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

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
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.personalDetails.fm_personal_details_aliases = [
      ...structuredClone(component.personalDetails.fm_personal_details_aliases),
      { fm_personal_details_alias_forenames_1: 'James', fm_personal_details_alias_surname_1: 'Smith' },
      { fm_personal_details_alias_forenames_2: 'Emily', fm_personal_details_alias_surname_2: 'Johnston' },
      { fm_personal_details_alias_forenames_3: 'Oliver', fm_personal_details_alias_surname_4: 'Brown' },
      { fm_personal_details_alias_forenames_4: 'Sophia', fm_personal_details_alias_surname_4: 'Taylor' },
    ];

    component['getAliasesData']();

    expect(component.aliases).toEqual([
      'Testing Test',
      'James Smith',
      'Emily Johnston',
      'Oliver Brown',
      'Sophia Taylor',
    ]);
  });

  it('should format date of birth correctly - adult', () => {
    if (!component || !mockDateService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockDateService.calculateAge.and.returnValue(34);
    mockDateService.getFromFormatToFormat.and.returnValue('01 January 1990');

    component['getDateOfBirthData']();

    expect(component.dob).toBe('01 January 1990 (Adult)');
  });

  it('should format date of birth correctly - youth', () => {
    if (!component || !mockDateService) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockDob = DateTime.now().minus({ years: 10 });

    component.personalDetails = {
      ...component.personalDetails,
      fm_personal_details_dob: mockDob.toFormat('dd/MM/yyyy'),
    };

    mockDateService.calculateAge.and.returnValue(10);
    mockDateService.getFromFormatToFormat.and.returnValue(mockDob.toFormat('dd MMMM yyyy'));

    component['getDateOfBirthData']();

    expect(component.dob).toBe(`${mockDob.toFormat('dd MMMM yyyy')} (Youth)`);
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
      component.personalDetails.fm_personal_details_address_line_1,
      component.personalDetails.fm_personal_details_address_line_2,
      component.personalDetails.fm_personal_details_address_line_3,
      component.personalDetails.fm_personal_details_post_code,
    ]);
    expect(component.address).toBe(formattedAddress);
  });

  it('should emit change personal details event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangePersonalDetails, 'emit');

    component.changePersonalDetails();

    expect(component.emitChangePersonalDetails.emit).toHaveBeenCalled();
  });

  it('should call getPersonalDetailsData on init', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getPersonalDetailsData');

    component.ngOnInit();

    expect(component['getPersonalDetailsData']).toHaveBeenCalled();
  });
});
