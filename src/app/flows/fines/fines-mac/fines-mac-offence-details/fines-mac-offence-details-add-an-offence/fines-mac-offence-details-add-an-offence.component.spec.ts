import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceComponent } from './fines-mac-offence-details-add-an-offence.component';
import { ActivatedRoute } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { OPAL_FINES_OFFENCES_REF_DATA } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-autocomplete-items.mock';
import { UtilsService } from '@services/utils/utils.service';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_OFFENCE_DETAILS_STATE } from '../constants/fines-mac-offence-details-state';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../constants/fines-mac-offence-details-result-codes';
import { FormArray, FormGroup } from '@angular/forms';

describe('FinesMacOffenceDetailsAddAnOffenceComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['upperCaseAllLetters']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceComponent);
    component = fixture.componentInstance;

    component.offences = OPAL_FINES_OFFENCES_REF_DATA;
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

  it('should update the value of fm_offence_details_offence_code to uppercase', () => {
    component.offences = OPAL_FINES_OFFENCES_REF_DATA;
    const cjs_code = component.offences.refData[0].get_cjs_code;

    component['offenceCodeListener']();
    component.form.controls['fm_offence_details_offence_code'].setValue(cjs_code.toLowerCase());

    expect(component.form.controls['fm_offence_details_offence_code'].value).toBe(cjs_code);
  });

  it('should set selectedOffenceConfirmation to true and selectedOffenceSuccessful to true when a valid offence code is entered', () => {
    component.offences = OPAL_FINES_OFFENCES_REF_DATA;

    component['offenceCodeListener']();
    component.form.controls['fm_offence_details_offence_code'].setValue(component.offences.refData[0].get_cjs_code);

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(component.selectedOffenceSuccessful).toBe(true);
    expect(component.selectedOffenceTitle).toBe(component.offences.refData[0].offence_title);
  });

  it('should set selectedOffenceConfirmation to false and selectedOffenceSuccessful to false when an invalid offence code is entered', () => {
    component.offences = OPAL_FINES_OFFENCES_REF_DATA;

    component['offenceCodeListener']();
    component.form.controls['fm_offence_details_offence_code'].setValue('TEST');

    expect(component.selectedOffenceConfirmation).toBe(false);
    expect(component.selectedOffenceSuccessful).toBe(false);
    expect(component.selectedOffenceTitle).toBe('Enter a valid offence code');
  });
});
