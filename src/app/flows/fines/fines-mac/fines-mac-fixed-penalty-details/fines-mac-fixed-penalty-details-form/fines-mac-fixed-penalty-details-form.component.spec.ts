import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FinesMacFixedPenaltyDetailsFormComponent } from './fines-mac-fixed-penalty-details-form.component';
import { FINES_MAC_FIXED_PENALTY_DETAILS_FORM_MOCK } from '../mocks/fines-mac-fixed-penalty-details-form.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMacOffenceDetailsService } from '../../fines-mac-offence-details/services/fines-mac-offence-details.service';
import { OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-autocomplete-items.mock';
import { FormControl, Validators } from '@angular/forms';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { TransformationService } from '@hmcts/opal-frontend-common/services/transformation-service';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../../fines-mac-offence-details/constants/fines-mac-offence-details-default-values.constant';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';

describe('FinesMacFixedPenaltyFormComponent', () => {
  let component: FinesMacFixedPenaltyDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacFixedPenaltyDetailsFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockTransformationService: jasmine.SpyObj<TransformationService>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>; // Replace with actual service type if available
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, [
      'isValidDate',
      'calculateAge',
      'getPreviousDate',
      'getAgeObject',
    ]);
    mockOpalFinesService = jasmine.createSpyObj(OpalFines, ['getOffenceByCjsCode']);
    mockTransformationService = jasmine.createSpyObj(TransformationService, ['replaceKeys']);

    await TestBed.configureTestingModule({
      imports: [FinesMacFixedPenaltyDetailsFormComponent],
      providers: [
        {
          provide: FinesMacOffenceDetailsService,
          useClass: FinesMacOffenceDetailsService,
        },
        {
          provide: UtilsService,
          useClass: UtilsService,
        },
        {
          provide: OpalFines,
          useValue: mockOpalFinesService,
        },
        {
          provide: TransformationService,
          useValue: mockTransformationService,
        },
        {
          provide: FinesMacStore,
          useClass: FinesMacStore,
        },
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacFixedPenaltyDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;
    component.enforcingCourtAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;
    component.issuingAuthorityAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with the correct controls', () => {
    component['setupFixedPenaltyDetailsForm']();
    Object.keys(FINES_MAC_FIXED_PENALTY_DETAILS_FORM_MOCK.formData).forEach((key) => {
      expect(component.form.contains(key)).toBeTrue();
    });
  });

  it('should add validators to the form controls', () => {
    component['setupFixedPenaltyDetailsForm']();
    component['offenceTypeListener']();
    component.form.get('fm_fp_offence_details_offence_type')?.setValue('vehicle');

    expect(
      component.form.get('fm_fp_offence_details_vehicle_registration_number')?.hasValidator(Validators.required),
    ).toBeTrue();
    expect(
      component.form.get('fm_fp_offence_details_driving_licence_number')?.hasValidator(Validators.required),
    ).toBeTrue();
  });

  it('should remove validators from the form controls', () => {
    component['setupFixedPenaltyDetailsForm']();
    component['offenceTypeListener']();
    component.form.get('fm_fp_offence_details_offence_type')?.setValue('non-vehicle');

    expect(
      component.form.get('fm_fp_offence_details_vehicle_registration_number')?.hasValidator(Validators.required),
    ).toBeFalse();
    expect(
      component.form.get('fm_fp_offence_details_driving_licence_number')?.hasValidator(Validators.required),
    ).toBeFalse();
  });

  it('should listen to changes in the dob and update the dateObject', () => {
    mockDateService.getAgeObject.and.returnValue({ value: 46, group: 'Adult' });
    component['setupFixedPenaltyDetailsForm']();
    component['dateOfBirthListener']();
    const dobControl = component.form.controls['fm_fp_personal_details_dob'];
    dobControl?.setValue('01-01-1979');

    expect(component.age).toEqual({ value: 46, group: 'Adult' });
  });

  it('should generate languageOptions from FINES_MAC_LANGUAGE_PREFERENCES_OPTIONS', () => {
    const expectedOptions = [
      { key: 'CY', value: 'Welsh and English' },
      { key: 'EN', value: 'English only' },
    ];

    expect(component.languageOptions).toEqual(expectedOptions);
  });

  it('should perform the initial setup for the fixed penalty details form', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupFixedPenaltyDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'dateOfBirthListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'offenceTypeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupOffenceCodeListener');

    component['initialFixedPenaltyDetailsSetup']();

    expect(component['transformationService']['replaceKeys']).toHaveBeenCalled();
    expect(component['setupFixedPenaltyDetailsForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalled();
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(component['offenceTypeListener']).toHaveBeenCalled();
    expect(component['setupOffenceCodeListener']).toHaveBeenCalled();
  });

  it('should update offenceCode$ and selectedOffenceConfirmation when callbacks are invoked', fakeAsync(() => {
    mockOpalFinesService.getOffenceByCjsCode.and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK));

    component['setupFixedPenaltyDetailsForm']();
    component.form.addControl('fm_fp_offence_details_offence_id', new FormControl(''));
    component.form.addControl('fm_fp_offence_details_offence_cjs_code', new FormControl(''));

    // Act
    component['setupOffenceCodeListener']();

    component.form.get('fm_fp_offence_details_offence_cjs_code')?.setValue('AK123456');

    tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

    // Assert
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any;
    component.offenceCode$.subscribe((v) => (value = v));
    expect(value).toEqual(OPAL_FINES_OFFENCES_REF_DATA_MOCK);
    expect(component.selectedOffenceConfirmation).toBeTrue();
  }));

  it('should set initial value if dob value already exists', () => {
    component['setupFixedPenaltyDetailsForm']();
    component.form.get('fm_fp_personal_details_dob')?.setValue('01-01-1979');
    component['dateOfBirthListener']();
    expect(component.form.get('fm_fp_personal_details_dob')?.value).toBe('01-01-1979');
  });
});
