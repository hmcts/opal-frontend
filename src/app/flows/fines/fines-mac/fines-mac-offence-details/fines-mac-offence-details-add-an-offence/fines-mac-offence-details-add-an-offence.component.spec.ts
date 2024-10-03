import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-autocomplete-items.mock';
import { UtilsService } from '@services/utils/utils.service';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../constants/fines-mac-offence-details-state';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes';
import { FormArray, FormGroup } from '@angular/forms';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FinesMacOffenceDetailsAddAnOffenceComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['upperCaseAllLetters']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesService, useValue: mockFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceComponent);
    component = fixture.componentInstance;

    component.resultCodeItems = OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK;
    component.formData = FINES_MAC_OFFENCE_DETAILS_STATE;
    component.formDataIndex = 0;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set needsCreditorControl value to true when result_code is compensation', () => {
    const index = 0;
    const result_code = FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.compensation;
    const impositionsFormArray = fixture.componentInstance.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_code_${index}`];
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    resultCodeControl.setValue(result_code);

    expect(needsCreditorControl.value).toBe(true);
  });

  it('should set needsCreditorControl value to true when result_code is costs', () => {
    const index = 0;
    const result_code = FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs;
    const impositionsFormArray = fixture.componentInstance.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_code_${index}`];
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    resultCodeControl.setValue(result_code);

    expect(needsCreditorControl.value).toBe(true);
  });

  it('should set needsCreditorControl value to false when result_code is not compensation or costs', () => {
    const index = 0;
    const result_code = 'other_result_code';
    const impositionsFormArray = fixture.componentInstance.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_code_${index}`];
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    resultCodeControl.setValue(result_code);

    expect(needsCreditorControl.value).toBe(false);
  });

  it('should set selectedOffenceConfirmation to false', () => {
    component.selectedOffenceConfirmation = true;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should update offenceCodeControl value with uppercased value', () => {
    const mockCjsCode = 'abc123';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];
    mockUtilsService.upperCaseAllLetters.and.returnValue(mockCjsCode);

    component['offenceCodeListener']();
    offenceCodeControl.setValue('lowercase');

    expect(offenceCodeControl.value).toBe(mockCjsCode);
    expect(mockUtilsService.upperCaseAllLetters).toHaveBeenCalledWith('lowercase');
  });

  it('should set selectedOffenceConfirmation to false when cjs_code length is not between 7 and 8', () => {
    const mockCjsCode = 'abc12345';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true and call getOffenceByCjsCode when cjs_code length is between 7 and 8', fakeAsync(() => {
    const mockCjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    // Simulate the passage of 250ms to account for debounceTime
    tick(250);

    // Check if service was called after debounce
    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(mockCjsCode);
  }));

  it('should set selectedOffenceConfirmation to false when cjs_code length is not between 7 and 8', fakeAsync(() => {
    const mockCjsCode = 'abc123450';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    // Simulate the passage of 250ms to account for debounceTime
    tick(250);

    // Check if the selectedOffenceConfirmation is set to false
    expect(component.selectedOffenceConfirmation).toBe(false);
    expect(mockOpalFinesService.getOffenceByCjsCode).not.toHaveBeenCalled();
  }));
});
