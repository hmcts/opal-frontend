import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceFormComponent } from './fines-mac-offence-details-add-an-offence-form.component';
import { DateService } from '@services/date-service/date.service';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@services/utils/utils.service';
import { of } from 'rxjs';
import { FINES_MAC_STATE_MOCK } from '../../../mocks/fines-mac-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state.constant';
import { FinesMacOffenceDetailsService } from '../../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-autocomplete-items.mock';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../constants/fines-mac-offence-details-result-codes.constant';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';
import { FinesMacOffenceDetailsDebounceTime } from '../../enums/fines-mac-offence-details-debounce-time.enum';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../../constants/fines-mac-offence-details-form.constant';
import { OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-autocomplete-items.mock';

describe('FinesMacOffenceDetailsAddAnOffenceFormComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceFormComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['upperCaseAllLetters']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceFormComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsAddAnOffenceFormComponent);
    component = fixture.componentInstance;

    component.resultCodeItems = OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK;
    component.majorCreditorItems = OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK;

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

  it('should set needsCreditorControl value to true on initial call of resultCodeListener', () => {
    const index = 0;
    const impositionsFormArray = fixture.componentInstance.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    needsCreditorControl.setValue(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'creditorListener');
    component['resultCodeListener'](index);

    expect(component['creditorListener']).toHaveBeenCalledWith(index);
  });

  it('should set needsCreditorControl value to true on initial call of resultCodeListener', () => {
    const index = 0;
    const impositionsFormArray = fixture.componentInstance.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_code_${index}`];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'creditorListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeFormArrayFormGroupControlValidators');

    component['resultCodeListener'](index);

    resultCodeControl.setValue('TEST123');

    expect(component['removeFormArrayFormGroupControlValidators']).toHaveBeenCalled();
  });

  it('should set selectedOffenceConfirmation to false', () => {
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];
    offenceCodeControl.reset();
    component.selectedOffenceConfirmation = true;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true when already populated', () => {
    component['finesMacOffenceDetailsService'].finesMacOffenceDetailsDraftState =
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    component[
      'finesMacOffenceDetailsService'
    ].finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].formData.fm_offence_details_offence_code = 'TEST1234';

    component['initialAddAnOffenceDetailsSetup']();

    component.selectedOffenceConfirmation = false;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(true);
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
    offenceCodeControl.reset();

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true and call getOffenceByCjsCode when cjs_code length is between 7 and 8', fakeAsync(() => {
    const mockCjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];
    offenceCodeControl.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'populateOffenceHint');

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    // Simulate the passage of time to account for debounceTime
    tick(FinesMacOffenceDetailsDebounceTime.debounceTime);

    // Check if service was called after debounce
    expect(component['populateOffenceHint']).toHaveBeenCalledWith(mockCjsCode);
  }));

  it('should set selectedOffenceConfirmation to false when cjs_code length is not between 7 and 8', fakeAsync(() => {
    const mockCjsCode = 'abc123450';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];
    offenceCodeControl.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'populateOffenceHint');

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    // Simulate the passage of time to account for debounceTime
    tick(FinesMacOffenceDetailsDebounceTime.debounceTime);

    // Check if service was called after debounce
    expect(component['populateOffenceHint']).toHaveBeenCalledWith(mockCjsCode);
  }));

  it('should set selectedOffenceConfirmation to true and call getOffenceByCjsCode when cjsCode length is between 7 and 8', () => {
    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(cjsCode);
    expect(offenceCodeControl.errors).toEqual(null);
  });

  it('should set errors on offence code control', () => {
    (mockOpalFinesService.getOffenceByCjsCode as jasmine.Spy).and.returnValue(of({ count: 0, refData: [] }));

    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(cjsCode);
    expect(offenceCodeControl.errors).toEqual({ invalidOffenceCode: true });
  });

  it('should set selectedOffenceConfirmation to false when cjsCode length is not between 7 and 8', () => {
    const cjsCode = 'abc123458';

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should initialize the form and setup initial configuration empty', () => {
    mockFinesService.finesMacState.offenceDetails = FINES_MAC_OFFENCE_DETAILS_FORM;
    const offenceDetailsDraft = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
    const impositionsKey = 'fm_offence_details_impositions';
    const hasOffenceDetailsDraft = offenceDetailsDraft.offenceDetailsDraft.length > 0;
    const formData = hasOffenceDetailsDraft
      ? offenceDetailsDraft.offenceDetailsDraft[0].formData
      : component['finesMacService'].finesMacState.offenceDetails[0].formData;
    const impositionsLength = formData[impositionsKey].length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupAddAnOffenceForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupImpositionsConfiguration');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupFormArrayFormControls');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'offenceCodeListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addControlsToFormArray');

    mockDateService.toFormat.and.returnValue('01/01/2022');

    component['initialAddAnOffenceDetailsSetup']();

    expect(component['setupAddAnOffenceForm']).toHaveBeenCalled();
    expect(component['setupImpositionsConfiguration']).toHaveBeenCalled();
    expect(component['setupFormArrayFormControls']).toHaveBeenCalledWith(
      [...Array(impositionsLength).keys()],
      impositionsKey,
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(formData);
    expect(component['offenceCodeListener']).toHaveBeenCalled();

    if (!offenceDetailsDraft.offenceDetailsDraft.length && impositionsLength === 0) {
      expect(component.addControlsToFormArray).toHaveBeenCalledWith(0, impositionsKey);
    }

    expect(component.today).toBe('01/01/2022');
  });

  it('should populate offence details draft when navigating to search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component['rePopulateForm'](FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft[0].formData);

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component['finesMacOffenceDetailsService'].finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
    component['initialAddAnOffenceDetailsSetup']();

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is populated - search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - remove imposition', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();
    component['finesMacOffenceDetailsService'].finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    component.removeImpositionConfirmation(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeImposition!.rowIndex);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is populated - remove imposition', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();

    component.removeImpositionConfirmation(0);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test majorCreditorValidation and add validator when add is true', () => {
    const index = 0;
    const formGroup = new FormGroup({
      fm_offence_details_major_creditor: new FormGroup({
        fm_offence_details_major_creditor_0: new FormControl(''),
      }),
    });
    const formArrayFormGroupControl = component.getFormArrayFormGroupControl(
      formGroup,
      'fm_offence_details_major_creditor',
      0,
    );

    spyOn(component, 'addFormArrayFormGroupControlValidators');
    spyOn(component, 'removeFormArrayFormGroupControlValidators');

    component['majorCreditorValidation'](index, true, formGroup);

    expect(component.addFormArrayFormGroupControlValidators).toHaveBeenCalledWith(formArrayFormGroupControl, [
      Validators.required,
    ]);
    expect(component.removeFormArrayFormGroupControlValidators).not.toHaveBeenCalled();
  });

  it('should test majorCreditorValidation and remove validator when add is false', () => {
    const index = 0;
    const formGroup = new FormGroup({
      fm_offence_details_major_creditor: new FormGroup({
        fm_offence_details_major_creditor_0: new FormControl('', [Validators.required]),
      }),
    });
    const formArrayFormGroupControl = component.getFormArrayFormGroupControl(
      formGroup,
      'fm_offence_details_major_creditor',
      0,
    );

    spyOn(component, 'addFormArrayFormGroupControlValidators');
    spyOn(component, 'removeFormArrayFormGroupControlValidators');

    component['majorCreditorValidation'](index, false, formGroup);

    expect(component.addFormArrayFormGroupControlValidators).not.toHaveBeenCalled();
    expect(component.removeFormArrayFormGroupControlValidators).toHaveBeenCalledWith(formArrayFormGroupControl);
  });

  it('should perform major creditor validation when creditor value is major', () => {
    const index = 0;
    const creditorValue = 'major';
    const impositionsFormGroup = component.getFormArrayFormGroup(index, 'fm_offence_details_impositions');
    const creditorControl = component.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_creditor',
      index,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'majorCreditorValidation');

    component['creditorListener'](index);

    creditorControl.setValue(creditorValue);

    expect(component['majorCreditorValidation']).toHaveBeenCalledWith(index, true, impositionsFormGroup);
  });

  it('should perform major creditor validation when creditor value is minor', () => {
    const index = 0;
    const creditorValue = 'minor';
    const impositionsFormGroup = component.getFormArrayFormGroup(index, 'fm_offence_details_impositions');
    const creditorControl = component.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_creditor',
      index,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'majorCreditorValidation');

    component['creditorListener'](index);

    creditorControl.setValue(creditorValue);

    expect(component['majorCreditorValidation']).toHaveBeenCalledWith(index, false, impositionsFormGroup);
  });

  it('should trigger majorCreditorValidation when the control is already populated when loading the listener', () => {
    const index = 0;
    const creditorValue = 'major';
    const impositionsFormGroup = component.getFormArrayFormGroup(index, 'fm_offence_details_impositions');
    const creditorControl = component.getFormArrayFormGroupControl(
      impositionsFormGroup,
      'fm_offence_details_creditor',
      index,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'majorCreditorValidation');

    creditorControl.setValue(creditorValue);

    component['creditorListener'](index);

    expect(component['majorCreditorValidation']).toHaveBeenCalledWith(index, true, impositionsFormGroup);
  });
});
