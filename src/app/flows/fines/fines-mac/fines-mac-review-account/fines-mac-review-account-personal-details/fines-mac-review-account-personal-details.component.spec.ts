import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacReviewAccountPersonalDetailsComponent } from './fines-mac-review-account-personal-details.component';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_PERSONAL_DETAILS_STATE_MOCK } from '../../fines-mac-personal-details/mocks/fines-mac-personal-details-state.mock';
import { DateTime } from 'luxon';

describe('FinesMacReviewAccountPersonalDetailsComponent', () => {
  let component: FinesMacReviewAccountPersonalDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountPersonalDetailsComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj('DateService', ['getFromFormat', 'calculateAge', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountPersonalDetailsComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountPersonalDetailsComponent);
    component = fixture.componentInstance;

    component.personalDetails = { ...FINES_MAC_PERSONAL_DETAILS_STATE_MOCK };

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
    expect(component.aliases).toBe('Testing Test<br>James Smith<br>Emily Johnston<br>Oliver Brown<br>Sophia Taylor');
  });

  it('should format date of birth correctly - adult', () => {
    const mockDob = DateTime.fromISO('1990-01-01');
    mockDateService.getFromFormat.and.returnValue(mockDob);
    mockDateService.calculateAge.and.returnValue(34);
    mockDateService.toFormat.and.returnValue('01 January 1990');

    component['getDateOfBirthData']();
    expect(component.dob).toBe('01 January 1990 (Adult)');
  });

  it('should format date of birth correctly - youth', () => {
    const mockDob = DateTime.now().minus({ years: 10 });

    component.personalDetails = {
      ...component.personalDetails,
      fm_personal_details_dob: mockDob.toFormat('dd/MM/yyyy'),
    };

    mockDateService.getFromFormat.and.returnValue(mockDob);
    mockDateService.calculateAge.and.returnValue(10);
    mockDateService.toFormat.and.returnValue(mockDob.toFormat('dd MMMM yyyy'));

    component['getDateOfBirthData']();
    expect(component.dob).toBe(`${mockDob.toFormat('dd MMMM yyyy')} (Youth)`);
  });

  it('should format address correctly', () => {
    mockUtilsService.formatAddress.and.returnValue('123 Main St<br>Apt 4B<br>Springfield<br>12345');

    component['getAddressData']();
    expect(component.address).toBe('123 Main St<br>Apt 4B<br>Springfield<br>12345');
  });

  it('should emit change personal details event', () => {
    spyOn(component.emitChangePersonalDetails, 'emit');

    component.changePersonalDetails();
    expect(component.emitChangePersonalDetails.emit).toHaveBeenCalled();
  });

  it('should call getPersonalDetailsData on init', () => {
    spyOn(component as any, 'getPersonalDetailsData');

    component.ngOnInit();
    expect(component['getPersonalDetailsData']).toHaveBeenCalled();
  });
});
