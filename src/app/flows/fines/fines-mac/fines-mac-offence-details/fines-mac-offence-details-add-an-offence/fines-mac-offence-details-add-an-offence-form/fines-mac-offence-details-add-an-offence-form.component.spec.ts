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
import { FinesMacOffenceDetailsDebounceTime } from '../../enums/fines-mac-offence-details-debounce-time.enum';
import { OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-autocomplete-items.mock';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths';
import { AbstractFormArrayBaseComponent } from '@components/abstract/abstract-form-array-base/abstract-form-array-base';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../mocks/fines-mac-offence-details-form.mock';

describe('FinesMacOffenceDetailsAddAnOffenceFormComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceFormComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceFormComponent> | null;
  let mockOpalFinesService: Partial<OpalFines> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };

    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
      'emptyOffences',
      'offenceCodeMessage',
    ]);
    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService!.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };

    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'upperCaseAllLetters',
      'formatSortCode',
      'upperCaseFirstLetter',
    ]);

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

    spyOn(AbstractFormArrayBaseComponent.prototype, 'handleFormSubmit').and.callThrough();

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    mockFinesMacOffenceDetailsService = null;
    mockOpalFinesService = null;
    mockUtilsService = null;
    mockDateService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set needsCreditorControl value to true when result_code is compensation', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    component.ngOnInit();
    const index = 0;
    const result_code = FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.compensation;
    const impositionsFormArray = component.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_id_${index}`];
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    resultCodeControl.setValue(result_code);

    expect(needsCreditorControl.value).toBe(true);
  });

  it('should set needsCreditorControl value to true when result_code is costs', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    component.ngOnInit();
    const index = 0;
    const result_code = FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs;
    const impositionsFormArray = component.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultCodeControl = impositionsFormGroup.controls[`fm_offence_details_result_id_${index}`];
    const needsCreditorControl = impositionsFormGroup.controls[`fm_offence_details_needs_creditor_${index}`];

    resultCodeControl.setValue(result_code);

    expect(needsCreditorControl.value).toBe(true);
  });

  it('should set needsCreditorControl value to true on initial call of resultCodeListener', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    component.ngOnInit();
    const index = 0;
    const impositionsFormArray = component.form.get('fm_offence_details_impositions') as FormArray;
    const impositionsFormGroup = impositionsFormArray.controls[index] as FormGroup;
    const resultIdControl = impositionsFormGroup.controls[`fm_offence_details_result_id_${index}`] as FormControl;
    const creditorControl = impositionsFormGroup.controls[`fm_offence_details_creditor_${index}`] as FormControl;
    const needsCreditorControl = impositionsFormGroup.controls[
      `fm_offence_details_needs_creditor_${index}`
    ] as FormControl;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'creditorListener');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'addFormArrayFormGroupControlValidators');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'removeFormArrayFormGroupControlValidators');

    resultIdControl.setValue(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.costs);

    component['resultCodeListener'](index);

    expect(needsCreditorControl.value).toBeTrue();
    expect(component['creditorListener']).toHaveBeenCalledWith(index);

    creditorControl.setValue('major');
    expect(needsCreditorControl.value).toBeTrue();
    expect(component['creditorListener']).toHaveBeenCalledWith(index);
    expect(component['addFormArrayFormGroupControlValidators']).toHaveBeenCalledWith(creditorControl, [
      Validators.required,
    ]);

    resultIdControl.setValue(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES.fineOnly);
    expect(needsCreditorControl.value).toBeFalse();
    expect(component['removeFormArrayFormGroupControlValidators']).toHaveBeenCalledTimes(4);
  });

  it('should set selectedOffenceConfirmation to false', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];
    offenceCodeControl.reset();
    component.selectedOffenceConfirmation = true;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true when already populated', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    const mockData = { ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK };
    mockData.offenceDetailsDraft[0] = {
      ...mockData.offenceDetailsDraft[0],
      formData: {
        ...mockData.offenceDetailsDraft[0].formData,
        fm_offence_details_offence_id: 'TEST1234',
      },
    };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = mockData;

    component['initialAddAnOffenceDetailsSetup']();

    component.selectedOffenceConfirmation = false;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(true);
  });

  it('should update offenceCodeControl value with uppercased value', () => {
    if (!component || !mockUtilsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockCjsCode = 'abc123';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];
    mockUtilsService.upperCaseAllLetters.and.returnValue(mockCjsCode);

    component['offenceCodeListener']();
    offenceCodeControl.setValue('lowercase');

    expect(offenceCodeControl.value).toBe(mockCjsCode);
    expect(mockUtilsService.upperCaseAllLetters).toHaveBeenCalledWith('lowercase');
  });

  it('should set selectedOffenceConfirmation to false when cjs_code length is not between 7 and 8', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockCjsCode = 'abc12345';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];
    offenceCodeControl.reset();

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true and call getOffenceByCjsCode when cjs_code length is between 7 and 8', fakeAsync(() => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockCjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];
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
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockCjsCode = 'abc123450';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];
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
    if (!component || !mockOpalFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(cjsCode);
    expect(offenceCodeControl.errors).toEqual(null);
  });

  it('should set errors on offence code control', () => {
    if (!component || !mockOpalFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    (mockOpalFinesService.getOffenceByCjsCode as jasmine.Spy).and.returnValue(of({ count: 0, refData: [] }));

    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_id'];

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(cjsCode);
    expect(offenceCodeControl.errors).toEqual({ invalidOffenceCode: true });
  });

  it('should set selectedOffenceConfirmation to false when cjsCode length is not between 7 and 8', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const cjsCode = 'abc123458';

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should populate offence details draft when navigating to search offences', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - search offences', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = structuredClone(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );
    component['initialAddAnOffenceDetailsSetup']();

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is populated - search offences', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should go to minor creditor', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();
    component.goToMinorCreditor(0);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - remove imposition', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = structuredClone(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );

    component.removeImpositionConfirmation(0);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is populated - remove imposition', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();

    component.removeImpositionConfirmation(0);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test majorCreditorValidation and add validator when add is true', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const index = 0;
    const formGroup = new FormGroup({
      fm_offence_details_major_creditor_id: new FormGroup({
        fm_offence_details_major_creditor_id_0: new FormControl(''),
      }),
    });
    const formArrayFormGroupControl = component.getFormArrayFormGroupControl(
      formGroup,
      'fm_offence_details_major_creditor_id',
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
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const index = 0;
    const formGroup = new FormGroup({
      fm_offence_details_major_creditor_id: new FormGroup({
        fm_offence_details_major_creditor_id_0: new FormControl('', [Validators.required]),
      }),
    });
    const formArrayFormGroupControl = component.getFormArrayFormGroupControl(
      formGroup,
      'fm_offence_details_major_creditor_id',
      0,
    );

    spyOn(component, 'addFormArrayFormGroupControlValidators');
    spyOn(component, 'removeFormArrayFormGroupControlValidators');

    component['majorCreditorValidation'](index, false, formGroup);

    expect(component.addFormArrayFormGroupControlValidators).not.toHaveBeenCalled();
    expect(component.removeFormArrayFormGroupControlValidators).toHaveBeenCalledWith(formArrayFormGroupControl);
  });

  it('should perform major creditor validation when creditor value is major', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    component.ngOnInit();
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
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    component.ngOnInit();
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
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft = [];
    component.ngOnInit();
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

  it('should navigate to account details when emptyOffences is true', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.emptyOffences = true;
    const handleRouteSpy = spyOn(component, 'handleRoute');

    component.cancelLink();

    expect(handleRouteSpy).toHaveBeenCalledWith(
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`,
      true,
    );
  });

  it('should navigate to review offences when emptyOffences is false', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.emptyOffences = false;
    const handleRouteSpy = spyOn(component, 'handleRoute');

    component.cancelLink();

    expect(handleRouteSpy).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences);
  });

  it('should calculate balance remaining for each form group', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    // Create a sample form array with two form groups
    const formArray = new FormArray([
      new FormGroup({
        fm_offence_details_amount_imposed_0: new FormControl(100),
        fm_offence_details_amount_paid_0: new FormControl(50),
        fm_offence_details_balance_remaining_0: new FormControl(),
      }),
      new FormGroup({
        fm_offence_details_amount_imposed_1: new FormControl(200),
        fm_offence_details_amount_paid_1: new FormControl(150),
        fm_offence_details_balance_remaining_1: new FormControl(),
      }),
    ]);

    // Set the form array as the value of the component's form
    component.form.setControl('fm_offence_details_impositions', formArray);

    // Call the calculateBalanceRemaining method
    component['calculateBalanceRemaining']();

    // Check the balance remaining values in each form group
    const formGroupsFormArray = formArray.controls as FormGroup[];
    expect(formGroupsFormArray[0].controls['fm_offence_details_balance_remaining_0'].value).toBe(50);
    expect(formGroupsFormArray[1].controls['fm_offence_details_balance_remaining_1'].value).toBe(50);
  });

  it('should calculate balance remaining and call super.handleFormSubmit', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const event = jasmine.createSpyObj('event', ['preventDefault']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'calculateBalanceRemaining');

    component.handleAddAnOffenceSubmit(event);

    expect(component['calculateBalanceRemaining']).toHaveBeenCalled();
    expect(component.handleFormSubmit).toHaveBeenCalledWith(event);
  });

  it('should initialize the form and setup listeners', () => {
    if (!component || !mockFinesMacOffenceDetailsService || !mockFinesService || !mockDateService) {
      fail('Required properties not properly initialised');
      return;
    }

    // Mock data
    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    const offenceDetailsDraft = { ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft };
    offenceDetailsDraft[0].formData.fm_offence_details_impositions.splice(0, 1);
    const impositionsLength = offenceDetailsDraft[0].formData.fm_offence_details_impositions.length;

    // Mock dependencies
    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesService.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupResultCodeListener');
    mockDateService.toFormat.and.returnValue('01/01/2022');

    // Call the method
    component['initialAddAnOffenceDetailsSetup']();

    // Assertions
    expect(component['setupAddAnOffenceForm']).toHaveBeenCalled();
    expect(component['setupImpositionsConfiguration']).toHaveBeenCalled();
    expect(component['setupFormArrayFormControls']).toHaveBeenCalledWith(
      [...Array(impositionsLength).keys()],
      'fm_offence_details_impositions',
    );
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(offenceDetailsDraft[0].formData);
    expect(component['offenceCodeListener']).toHaveBeenCalled();
    expect(component['addControlsToFormArray']).not.toHaveBeenCalled();
    expect(component['setupResultCodeListener']).toHaveBeenCalledTimes(impositionsLength);
    expect(component.today).toBe('01/01/2022');
  });

  it('should update removeMinorCreditor in finesMacOffenceDetailsDraftState and call updateOffenceDetailsDraft and handleRoute', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
      removeMinorCreditor: 0,
    };

    component.minorCreditorActions({ action: 'remove', index: 0 });

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeMinorCreditor], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should update minorCreditorsHidden based on hidden imposition minor creditor', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    component.minorCreditorsHidden = { 0: false };

    component.minorCreditorActions({ action: 'showHideDetails', index: 0 });

    expect(component.minorCreditorsHidden).toEqual({ 0: true });
  });

  it('should return the correct minor creditor form data for the specified row index', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockMinorCreditorForm = structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK);
    component.offenceIndex = 0;
    mockFinesService.finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    mockFinesService.finesMacState.offenceDetails[0].childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
    ];

    const result = component.getMinorCreditor(0);

    expect(result).toEqual(mockMinorCreditorForm);
  });

  it('should return undefined if childFormData is not defined', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    component.offenceIndex = 0;
    mockFinesService.finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    mockFinesService.finesMacState.offenceDetails[0].childFormData = [];

    const result = component.getMinorCreditor(0);

    expect(result).toBeUndefined();
  });

  it('should return one item in the array of minor creditors', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 1,
        },
      },
    ];

    component['removeMinorCreditorData'](0);

    expect(
      mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData.length,
    ).toBe(1);
  });
});
