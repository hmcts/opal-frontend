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
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../constants/fines-mac-offence-details-draft-state';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths';

describe('FinesMacOffenceDetailsAddAnOffenceComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceComponent>;
  let mockOpalFinesService: jasmine.SpyObj<OpalFines>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    mockOpalFinesService = jasmine.createSpyObj('OpalFines', ['getOffenceByCjsCode']);
    mockOpalFinesService.getOffenceByCjsCode.and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK));

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, ['upperCaseAllLetters']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceComponent],
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
            parent: of('manual-account-creation'),
          },
        },
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

  it('should set selectedOffenceConfirmation to true when already populated', () => {
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].formData.fm_offence_details_offence_code =
      'TEST1234';
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

    // Simulate the passage of 250ms to account for debounceTime
    tick(250);

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

    // Simulate the passage of 250ms to account for debounceTime
    tick(250);

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
    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_code'];
    mockOpalFinesService.getOffenceByCjsCode.and.returnValue(of({ count: 0, refData: [] }));

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

  it('should initialize the form and setup initial configuration', () => {
    const offenceDetailsDraft = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    const impositionsKey = 'fm_offence_details_impositions';
    const impositionsLength = offenceDetailsDraft.offenceDetailsDraft[0].formData[impositionsKey].length;

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

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = offenceDetailsDraft;
    mockDateService.toFormat.and.returnValue('01/01/2022');
    mockOpalFinesService.getOffenceByCjsCode.and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK));

    component['initialAddAnOffenceDetailsSetup']();

    expect(component['setupAddAnOffenceForm']).toHaveBeenCalled();
    expect(component['setupImpositionsConfiguration']).toHaveBeenCalled();
    expect(component['setupFormArrayFormControls']).toHaveBeenCalledWith(
      [...Array(impositionsLength).keys()],
      impositionsKey,
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(offenceDetailsDraft.offenceDetailsDraft[0].formData);
    expect(component['offenceCodeListener']).toHaveBeenCalled();

    if (!offenceDetailsDraft.offenceDetailsDraft.length && impositionsLength === 0) {
      expect(component.addControlsToFormArray).toHaveBeenCalledWith(0, impositionsKey);
    }

    expect(component.today).toBe('01/01/2022');
  });

  it('should populate offence details draft when navigating to search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component['rePopulateForm'](FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft[0].formData);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;

    component.goToSearchOffences();

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].formData).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft[0].formData,
    );
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
    component['initialAddAnOffenceDetailsSetup']();

    component.goToSearchOffences();

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is populated - search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    component['initialAddAnOffenceDetailsSetup']();

    component.goToSearchOffences();

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    );
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - remove imposition', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    component['initialAddAnOffenceDetailsSetup']();
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    component.removeImpositionConfirmation(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeImposition!.rowIndex);

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is populated - remove imposition', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    component['initialAddAnOffenceDetailsSetup']();

    component.removeImpositionConfirmation(0);

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState).toEqual(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    );
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });
});
