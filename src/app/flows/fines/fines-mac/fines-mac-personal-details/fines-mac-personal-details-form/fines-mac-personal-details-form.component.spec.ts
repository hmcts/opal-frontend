import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPersonalDetailsFormComponent } from './fines-mac-personal-details-form.component';
import { FinesService } from '@services/fines';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import { IFinesMacPersonalDetailsFieldErrors, IFinesMacPersonalDetailsForm } from '../interfaces';
import { FINES_MAC_PERSONAL_DETAILS_ALIAS, FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS } from '../constants';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from '../mocks';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@services';

describe('FinesMacPersonalDetailsFormComponent', () => {
  let component: FinesMacPersonalDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacPersonalDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);
    mockDateService = jasmine.createSpyObj('DateService', ['isValidDate', 'calculateAge', 'getPreviousDate']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_PERSONAL_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacPersonalDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  beforeEach(() => {
    component.form.reset();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should set up the personal details form', () => {
    component['setupPersonalDetailsForm']();
    expect(component.form).toBeTruthy();
    expect(component.form.get('Title')).toBeTruthy();
    expect(component.form.get('Forenames')).toBeTruthy();
    expect(component.form.get('Surname')).toBeTruthy();
    expect(component.form.get('AddAlias')).toBeTruthy();
    expect(component.form.get('Aliases')).toBeTruthy();
    expect(component.form.get('DOB')).toBeTruthy();
    expect(component.form.get('NationalInsuranceNumber')).toBeTruthy();
    expect(component.form.get('AddressLine1')).toBeTruthy();
    expect(component.form.get('AddressLine2')).toBeTruthy();
    expect(component.form.get('AddressLine3')).toBeTruthy();
    expect(component.form.get('Postcode')).toBeTruthy();
    expect(component.form.get('VehicleMake')).toBeTruthy();
    expect(component.form.get('VehicleRegistrationMark')).toBeTruthy();
  });

  it('should set up the alias configuration for the personal details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(['AliasForenames', 'AliasSurname']);
    expect(component.aliasControlsValidation).toEqual(FINES_MAC_PERSONAL_DETAILS_ALIAS);
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(34);

    component.form.controls['DOB'].setValue(dateOfBirth);

    expect(mockDateService.isValidDate).toHaveBeenCalledWith(dateOfBirth);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
  });

  it('should call dateOfBirthListener on DOB value changes Youth', () => {
    const dateOfBirth = '01/01/2014';
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(10);

    component.form.controls['DOB'].setValue(dateOfBirth);

    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(10);
    expect(component.ageLabel).toEqual('Youth');
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    component.form.controls['DOB'].setValue(dateOfBirth);
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(34);

    component['dateOfBirthListener']();

    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
  });

  it('should call the necessary setup methods', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addVehicleDetailsFieldErrors');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.and.returnValue('19/08/2024');

    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(mockFinesService.finesMacState.personalDetails.Aliases.length).keys()],
      'Aliases',
    );
    expect(component['addVehicleDetailsFieldErrors']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.personalDetails);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith('AddAlias', 'Aliases');
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should call the necessary setup methods - parent/guardian', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupPersonalDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAliasFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addVehicleDetailsFieldErrors');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setUpAliasCheckboxListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'dateOfBirthListener');
    mockDateService.getPreviousDate.and.returnValue('19/08/2024');

    component.defendantType = 'parentOrGuardianToPay';
    component['initialPersonalDetailsSetup']();

    expect(component['setupPersonalDetailsForm']).toHaveBeenCalled();
    expect(component['setupAliasConfiguration']).toHaveBeenCalled();
    expect(component['setupAliasFormControls']).toHaveBeenCalledWith(
      [...Array(mockFinesService.finesMacState.personalDetails.Aliases.length).keys()],
      'Aliases',
    );
    expect(component['addVehicleDetailsFieldErrors']).not.toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.personalDetails);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith('AddAlias', 'Aliases');
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should add vehicle details field errors', () => {
    const expectedFieldErrors: IFinesMacPersonalDetailsFieldErrors = {
      Title: {
        required: {
          message: 'Select a title',
          priority: 1,
        },
      },
      VehicleMake: {
        maxlength: {
          message: `The make of car must be 30 characters or fewer`,
          priority: 1,
        },
      },
      VehicleRegistrationMark: {
        maxlength: {
          message: `The registration number must be 11 characters or fewer`,
          priority: 1,
        },
      },
    };

    component.fieldErrors = FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS;
    component['addVehicleDetailsFieldErrors']();

    expect(component.fieldErrors).toEqual(expectedFieldErrors);
  });
});
