import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesConSelectBuFormComponent } from './fines-con-select-bu-form.component';
import { FINES_CON_DEFENDANT_TYPES } from '../constants/fines-con-defendant-types.constant';
import { FINES_CON_SELECT_BU_FORM } from '../constants/fines-con-select-bu-form.constant';
import { IFinesConSelectBuForm } from '../interfaces/fines-con-select-bu-form.interface';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_CON_SELECT_BU_AUTOCOMPLETE_ITEMS_MOCK } from '../mocks/fines-con-select-bu-autocomplete-items.mock';

describe('FinesConSelectBuFormComponent', () => {
  let component: FinesConSelectBuFormComponent;
  let fixture: ComponentFixture<FinesConSelectBuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesConSelectBuFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSelectBuFormComponent);
    component = fixture.componentInstance;

    // Set required inputs before detectChanges
    component.autoCompleteItems = FINES_CON_SELECT_BU_AUTOCOMPLETE_ITEMS_MOCK;
    component.defendantTypes = FINES_CON_DEFENDANT_TYPES;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct default values', () => {
    expect(component.form.get('fcon_select_bu_business_unit_id')?.value).toBeNull();
    expect(component.form.get('fcon_select_bu_defendant_type')?.value).toBe('individual');
  });

  it('should have form controls defined', () => {
    expect(component.form.get('fcon_select_bu_business_unit_id')).toBeDefined();
    expect(component.form.get('fcon_select_bu_defendant_type')).toBeDefined();
  });

  it('should validate business unit ID as required', () => {
    const businessUnitControl = component.form.get('fcon_select_bu_business_unit_id');
    expect(businessUnitControl?.hasError('required')).toBeTruthy();

    businessUnitControl?.setValue(1);
    expect(businessUnitControl?.hasError('required')).toBeFalsy();
  });

  it('should validate defendant type as required', () => {
    const defendantTypeControl = component.form.get('fcon_select_bu_defendant_type');
    defendantTypeControl?.setValue(null);
    expect(defendantTypeControl?.hasError('required')).toBeTruthy();

    defendantTypeControl?.setValue('individual');
    expect(defendantTypeControl?.hasError('required')).toBeFalsy();
  });

  it('should accept valid form data', () => {
    component.form.patchValue({
      fcon_select_bu_business_unit_id: 1,
      fcon_select_bu_defendant_type: 'company',
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('should reject invalid form data when business unit is missing', () => {
    component.form.patchValue({
      fcon_select_bu_business_unit_id: null,
      fcon_select_bu_defendant_type: 'individual',
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('should reject invalid form data when defendant type is missing', () => {
    component.form.patchValue({
      fcon_select_bu_business_unit_id: 1,
      fcon_select_bu_defendant_type: null,
    });

    expect(component.form.valid).toBeFalsy();
  });

  it('should repopulate form with initial form data', () => {
    const initialFormData: IFinesConSelectBuForm = {
      formData: {
        fcon_select_bu_business_unit_id: 2,
        fcon_select_bu_defendant_type: 'company',
      },
      nestedFlow: false,
    };

    component.initialFormData = initialFormData;
    component.ngOnInit();

    expect(component.form.get('fcon_select_bu_business_unit_id')?.value).toBe(2);
    expect(component.form.get('fcon_select_bu_defendant_type')?.value).toBe('company');
  });

  it('should use default form data when initial form data is null', () => {
    component.initialFormData = null as never;
    component.ngOnInit();

    expect(component.initialFormData).toEqual(FINES_CON_SELECT_BU_FORM);
  });

  it('should set dashboard path from routing paths', () => {
    expect(component['dashboardPath']).toBe(PAGES_ROUTING_PATHS.children.dashboard);
  });

  it('should have fieldErrors defined', () => {
    expect(component['fieldErrors']).toBeDefined();
    expect(component['fieldErrors'].fcon_select_bu_business_unit_id).toBeDefined();
    expect(component['fieldErrors'].fcon_select_bu_defendant_type).toBeDefined();
  });

  it('should emit unsavedChanges event when defined', () => {
    spyOn(component['unsavedChanges'], 'emit');

    component['unsavedChanges'].emit(true);

    expect(component['unsavedChanges'].emit).toHaveBeenCalledWith(true);
  });

  it('should handle form changes correctly', () => {
    component.form.patchValue({
      fcon_select_bu_business_unit_id: 1,
    });

    expect(component.form.get('fcon_select_bu_business_unit_id')?.value).toBe(1);
  });

  it('should accept autocomplete items as input', () => {
    expect(component.autoCompleteItems).toEqual(FINES_CON_SELECT_BU_AUTOCOMPLETE_ITEMS_MOCK);
    expect(component.autoCompleteItems.length).toBe(3);
  });

  it('should accept defendant types as input', () => {
    expect(component.defendantTypes).toEqual(FINES_CON_DEFENDANT_TYPES);
  });

  it('should initialize error messages on init', () => {
    component.ngOnInit();
    expect(component['formControlErrorMessages']).toBeDefined();
  });

  it('should handle form submission with valid data', () => {
    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue({
      fcon_select_bu_business_unit_id: 1,
      fcon_select_bu_defendant_type: 'individual',
    });

    const mockEvent = new SubmitEvent('submit');
    component.handleFormSubmit(mockEvent);

    expect(component['formSubmit'].emit).toHaveBeenCalled();
  });

  it('should not submit form with invalid data', () => {
    spyOn(component['formSubmit'], 'emit');

    component.form.patchValue({
      fcon_select_bu_business_unit_id: null,
      fcon_select_bu_defendant_type: 'individual',
    });

    const mockEvent = new SubmitEvent('submit');
    component.handleFormSubmit(mockEvent);

    expect(component['formSubmit'].emit).not.toHaveBeenCalled();
  });
});
