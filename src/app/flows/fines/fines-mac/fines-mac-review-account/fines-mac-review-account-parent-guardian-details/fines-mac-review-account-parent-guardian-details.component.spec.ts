import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountParentGuardianDetailsComponent } from './fines-mac-review-account-parent-guardian-details.component';
import { DateService } from '@services/date-service/date.service';
import { UtilsService } from '@services/utils/utils.service';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-state.mock';

describe('FinesMacReviewAccountParentGuardianDetailsComponent', () => {
  let component: FinesMacReviewAccountParentGuardianDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacReviewAccountParentGuardianDetailsComponent> | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountParentGuardianDetailsComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: UtilsService, useValue: mockUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountParentGuardianDetailsComponent);
    component = fixture.componentInstance;

    component.parentGuardianDetails = structuredClone(FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK);

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockDateService = null;
    mockUtilsService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format aliases correctly', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.parentGuardianDetails.fm_parent_guardian_details_aliases = [
      ...structuredClone(component.parentGuardianDetails.fm_parent_guardian_details_aliases),
      { fm_parent_guardian_details_alias_forenames_1: 'James', fm_parent_guardian_details_alias_surname_1: 'Smith' },
      { fm_parent_guardian_details_alias_forenames_2: 'Emily', fm_parent_guardian_details_alias_surname_2: 'Johnston' },
      { fm_parent_guardian_details_alias_forenames_3: 'Oliver', fm_parent_guardian_details_alias_surname_4: 'Brown' },
      { fm_parent_guardian_details_alias_forenames_4: 'Sophia', fm_parent_guardian_details_alias_surname_4: 'Taylor' },
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

    mockDateService.getFromFormatToFormat.and.returnValue('01 January 1990');

    component['getDateOfBirthData']();

    expect(component.dob).toBe('01 January 1990');
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
      component.parentGuardianDetails.fm_parent_guardian_details_address_line_1,
      component.parentGuardianDetails.fm_parent_guardian_details_address_line_2,
      component.parentGuardianDetails.fm_parent_guardian_details_address_line_3,
      component.parentGuardianDetails.fm_parent_guardian_details_post_code,
    ]);
    expect(component.address).toBe(formattedAddress);
  });

  it('should emit change parent or guardian details event', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component.emitChangeParentGuardianDetails, 'emit');

    component.changeParentGuardianDetails();

    expect(component.emitChangeParentGuardianDetails.emit).toHaveBeenCalled();
  });

  it('should call getParentGuardianData on init', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'getParentGuardianData');

    component.ngOnInit();

    expect(component['getParentGuardianData']).toHaveBeenCalled();
  });
});
