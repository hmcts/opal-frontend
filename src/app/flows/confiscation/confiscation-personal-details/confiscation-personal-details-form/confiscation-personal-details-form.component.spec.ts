import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiscationPersonalDetailsFormComponent } from './confiscation-personal-details-form.component';
import { IConfiscationPersonalDetailsForm } from '../interfaces/confiscation-personal-details-form.interface';
import { CONFISCATION_PERSONAL_DETAILS_ALIAS } from '../constants/confiscation-personal-details-alias';
import { CONFISCATION_PERSONAL_DETAILS_FORM_MOCK } from '../mocks/confiscation-personal-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date-service/date.service';
import { CONFISCATION_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS as CONF_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS } from '../constants/confiscation-personal-details-vehicle-details-fields';
import { of } from 'rxjs';
import { ConfiscationStoreType } from '../../stores/types/confiscation-store.type';
import { ConfiscationStore } from '../../stores/confiscation.store';

describe('ConfiscationPersonalDetailsFormComponent', () => {
  let component: ConfiscationPersonalDetailsFormComponent;
  let fixture: ComponentFixture<ConfiscationPersonalDetailsFormComponent>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let confiscationStore: ConfiscationStoreType;

  let formSubmit: IConfiscationPersonalDetailsForm;
  beforeEach(async () => {
    mockDateService = jasmine.createSpyObj(DateService, ['isValidDate', 'calculateAge', 'getPreviousDate']);

    formSubmit = structuredClone(CONFISCATION_PERSONAL_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [ConfiscationPersonalDetailsFormComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiscationPersonalDetailsFormComponent);
    component = fixture.componentInstance;

    confiscationStore = TestBed.inject(ConfiscationStore);

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

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);
    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should set up the personal details form', () => {
    component['setupPersonalDetailsForm']('conf');
    expect(component.form).toBeTruthy();
    expect(component.form.get('conf_personal_details_title')).toBeTruthy();
    expect(component.form.get('conf_personal_details_forenames')).toBeTruthy();
    expect(component.form.get('conf_personal_details_surname')).toBeTruthy();
    expect(component.form.get('conf_personal_details_add_alias')).toBeTruthy();
    expect(component.form.get('conf_personal_details_aliases')).toBeTruthy();
    expect(component.form.get('conf_personal_details_dob')).toBeTruthy();
    expect(component.form.get('conf_personal_details_national_insurance_number')).toBeTruthy();
    expect(component.form.get('conf_personal_details_address_line_1')).toBeTruthy();
    expect(component.form.get('conf_personal_details_address_line_2')).toBeTruthy();
    expect(component.form.get('conf_personal_details_address_line_3')).toBeTruthy();
    expect(component.form.get('conf_personal_details_post_code')).toBeTruthy();
  });

  it('should set up the alias configuration for the personal details form', () => {
    component['setupAliasConfiguration']();
    expect(component.aliasFields).toEqual(CONFISCATION_PERSONAL_DETAILS_ALIAS.map((item) => item.controlName));
    expect(component.aliasControlsValidation).toEqual(CONFISCATION_PERSONAL_DETAILS_ALIAS);
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(34);

    component.form.controls['conf_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.isValidDate).toHaveBeenCalledWith(dateOfBirth);
    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(34);
    expect(component.ageLabel).toEqual('Adult');
  });

  it('should call dateOfBirthListener on DOB value changes Youth', () => {
    const dateOfBirth = '01/01/2014';
    mockDateService.isValidDate.and.returnValue(true);
    mockDateService.calculateAge.and.returnValue(10);

    component.form.controls['conf_personal_details_dob'].setValue(dateOfBirth);

    expect(mockDateService.calculateAge).toHaveBeenCalledWith(dateOfBirth);
    expect(component.age).toEqual(10);
    expect(component.ageLabel).toEqual('Youth');
  });

  it('should call dateOfBirthListener on DOB value changes Adult', () => {
    const dateOfBirth = '01/01/1990';
    component.form.controls['conf_personal_details_dob'].setValue(dateOfBirth);
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
    spyOn<any>(component, 'addVehicleDetailsControls');
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
      [...Array(confiscationStore.personalDetails().formData.conf_personal_details_aliases.length).keys()],
      'conf_personal_details_aliases',
    );
    expect(component['addVehicleDetailsControls']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(confiscationStore.personalDetails().formData);
    expect(component['setUpAliasCheckboxListener']).toHaveBeenCalledWith(
      'conf_personal_details_add_alias',
      'conf_personal_details_aliases',
    );
    expect(component['dateOfBirthListener']).toHaveBeenCalled();
    expect(mockDateService.getPreviousDate).toHaveBeenCalledWith({ days: 1 });
    expect(component.yesterday).toBeDefined();
  });

  it('should add vehicle details controls', () => {
    component['addVehicleDetailsControls']();

    CONF_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS.forEach((control) => {
      expect(component.form.get(control.controlName)).toBeTruthy();
    });
  });
});
