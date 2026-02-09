import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountParentGuardianDetailsComponent } from './fines-mac-review-account-parent-guardian-details.component';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '../../fines-mac-parent-guardian-details/mocks/fines-mac-parent-guardian-details-state.mock';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSpyObj } from '@app/testing/create-spy-obj';

describe('FinesMacReviewAccountParentGuardianDetailsComponent', () => {
  let component: FinesMacReviewAccountParentGuardianDetailsComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountParentGuardianDetailsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockUtilsService: any;

  beforeEach(async () => {
    mockDateService = createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
    mockUtilsService = createSpyObj(UtilsService, ['formatAddress', 'upperCaseFirstLetter']);

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format aliases correctly', () => {
    component.parentGuardianDetails.fm_parent_guardian_details_aliases = [
      ...component.parentGuardianDetails.fm_parent_guardian_details_aliases,
      { fm_parent_guardian_details_alias_forenames_1: 'James', fm_parent_guardian_details_alias_surname_1: 'Smith' },
      { fm_parent_guardian_details_alias_forenames_2: 'Emily', fm_parent_guardian_details_alias_surname_2: 'Johnston' },
      { fm_parent_guardian_details_alias_forenames_3: 'Oliver', fm_parent_guardian_details_alias_surname_4: 'Brown' },
      { fm_parent_guardian_details_alias_forenames_4: 'Sophia', fm_parent_guardian_details_alias_surname_4: 'Taylor' },
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
    mockDateService.getFromFormatToFormat.mockReturnValue('01 January 1990');

    component['getDateOfBirthData']();

    expect(component.dob).toBe('01 January 1990');
  });

  it('should format address correctly', () => {
    const formattedAddress = ['123 Main St', 'Apt 4B', 'Springfield', '12345'];
    mockUtilsService.formatAddress.mockReturnValue(formattedAddress);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.emitChangeParentGuardianDetails, 'emit');

    component.changeParentGuardianDetails();

    expect(component.emitChangeParentGuardianDetails.emit).toHaveBeenCalled();
  });

  it('should call getParentGuardianData on init', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'getParentGuardianData');

    component.ngOnInit();

    expect(component['getParentGuardianData']).toHaveBeenCalled();
  });
});
