import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinesMacOffenceDetailsAddAnOffenceFormComponent } from './fines-mac-offence-details-add-an-offence-form.component';
import { OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data-singular.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { of } from 'rxjs';
import { FINES_MAC_STATE_MOCK } from '../../../mocks/fines-mac-state.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-autocomplete-items.mock';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../constants/fines-mac-offence-details-result-codes.constant';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-autocomplete-items.mock';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from '../../../routing/constants/fines-mac-routing-paths.constant';
import { AbstractFormArrayBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-array-base';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../../mocks/fines-mac-offence-details-form.mock';
import { FinesMacStoreType } from '../../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStoreType } from '../../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../../stores/fines-mac-offence-details.store';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK } from '../../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES } from '../../constants/fines-mac-offence-details-default-values.constant';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

describe('FinesMacOffenceDetailsAddAnOffenceFormComponent', () => {
  let component: FinesMacOffenceDetailsAddAnOffenceFormComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsAddAnOffenceFormComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_SINGULAR_MOCK)),
    };
    mockDateService = jasmine.createSpyObj(DateService, ['getDateNow', 'toFormat']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'upperCaseAllLetters',
      'formatSortCode',
      'upperCaseFirstLetter',
      'scrollToTop',
    ]);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsAddAnOffenceFormComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
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

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(0);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeMinorCreditor);

    component.resultCodeItems = OPAL_FINES_RESULTS_AUTOCOMPLETE_ITEMS_MOCK;
    component.majorCreditorItems = OPAL_FINES_MAJOR_CREDITOR_AUTOCOMPLETE_ITEMS_MOCK;

    spyOn(AbstractFormArrayBaseComponent.prototype, 'handleFormSubmit').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set needsCreditorControl value to true when result_code is compensation', () => {
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([]);
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
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([]);
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
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([]);
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
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];
    offenceCodeControl.reset();
    component.selectedOffenceConfirmation = true;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true when already populated', () => {
    const offenceDetails = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    offenceDetails.formData = {
      ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData),
      fm_offence_details_offence_cjs_code: 'TEST1234',
    };

    finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceDetails]);

    component['initialAddAnOffenceDetailsSetup']();

    component.selectedOffenceConfirmation = false;

    component['offenceCodeListener']();

    expect(component.selectedOffenceConfirmation).toBe(true);
  });

  it('should update offenceCodeControl value with uppercased value', () => {
    const mockCjsCode = 'abc123';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];
    mockUtilsService.upperCaseAllLetters.and.returnValue(mockCjsCode);

    component['offenceCodeListener']();
    offenceCodeControl.setValue('lowercase');

    expect(offenceCodeControl.value).toBe(mockCjsCode);
    expect(mockUtilsService.upperCaseAllLetters).toHaveBeenCalledWith('lowercase');
  });

  it('should set selectedOffenceConfirmation to false when cjs_code length is not between 7 and 8', () => {
    const mockCjsCode = 'abc12345';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];
    offenceCodeControl.reset();

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    expect(component.selectedOffenceConfirmation).toBe(false);
  });

  it('should set selectedOffenceConfirmation to true and call getOffenceByCjsCode when cjs_code length is between 7 and 8', fakeAsync(() => {
    const mockCjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];
    offenceCodeControl.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'populateOffenceHint');

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    // Simulate the passage of time to account for defaultDebounceTime
    tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

    // Check if service was called after debounce
    expect(component['populateOffenceHint']).toHaveBeenCalledWith(mockCjsCode);
  }));

  it('should set selectedOffenceConfirmation to false when cjs_code length is not between 7 and 8', fakeAsync(() => {
    const mockCjsCode = 'abc123450';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];
    offenceCodeControl.reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'populateOffenceHint');

    component['offenceCodeListener']();
    offenceCodeControl.setValue(mockCjsCode);

    // Simulate the passage of time to account for defaultDebounceTime
    tick(FINES_MAC_OFFENCE_DETAILS_DEFAULT_VALUES.defaultDebounceTime);

    // Check if service was called after debounce
    expect(component['populateOffenceHint']).toHaveBeenCalledWith(mockCjsCode);
  }));

  it('should set selectedOffenceConfirmation to true and call getOffenceByCjsCode when cjsCode length is between 7 and 8', () => {
    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];

    component['populateOffenceHint'](cjsCode);

    expect(component.selectedOffenceConfirmation).toBe(true);
    expect(mockOpalFinesService.getOffenceByCjsCode).toHaveBeenCalledWith(cjsCode);
    expect(offenceCodeControl.errors).toEqual(null);
  });

  it('should set errors on offence code control', () => {
    (mockOpalFinesService.getOffenceByCjsCode as jasmine.Spy).and.returnValue(of({ count: 0, refData: [] }));

    const cjsCode = 'abc1234';
    const offenceCodeControl = component.form.controls['fm_offence_details_offence_cjs_code'];

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

  it('should populate offence details draft when navigating to search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.goToSearchOffences();

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to search offences when draft is empty - search offences', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    finesMacOffenceDetailsStore.resetStoreDraftImpositionMinor();
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

  it('should go to minor creditor', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();
    component.goToMinorCreditor(0);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to remove imposition when draft is empty', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component['initialAddAnOffenceDetailsSetup']();
    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRowIndex(0);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.removeMinorCreditor);
    component.removeImpositionConfirmation(0);

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should populate offence details draft when navigating to remove imposition when draft is populated', () => {
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
    finesMacOffenceDetailsStore.resetStoreDraftImpositionMinor();
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
    finesMacOffenceDetailsStore.resetStoreDraftImpositionMinor();
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
    finesMacOffenceDetailsStore.resetStoreDraftImpositionMinor();
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
    finesMacOffenceDetailsStore.setEmptyOffences(true);
    const handleRouteSpy = spyOn(component, 'handleRoute');

    component.cancelLink();

    expect(handleRouteSpy).toHaveBeenCalledWith(
      `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.accountDetails}`,
      true,
    );
  });

  it('should navigate to review offences when emptyOffences is false', () => {
    finesMacOffenceDetailsStore.setEmptyOffences(false);
    const handleRouteSpy = spyOn(component, 'handleRoute');

    component.cancelLink();

    expect(handleRouteSpy).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences);
  });

  it('should calculate balance remaining for each form group', () => {
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
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'calculateBalanceRemaining');

    component.handleAddAnOffenceSubmit(event);

    expect(component['calculateBalanceRemaining']).toHaveBeenCalled();
    expect(component.handleFormSubmit).toHaveBeenCalledWith(event);
  });

  it('should initialize the form and setup listeners', () => {
    // Mock data
    const offenceDetailsDraft = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    offenceDetailsDraft.formData.fm_offence_details_impositions.splice(0, 1);
    const impositionsLength = offenceDetailsDraft.formData.fm_offence_details_impositions.length;

    // Mock dependencies
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceDetailsDraft]);

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
    expect(component['rePopulateForm']).toHaveBeenCalledWith(offenceDetailsDraft.formData);
    expect(component['offenceCodeListener']).toHaveBeenCalled();
    expect(component['addControlsToFormArray']).not.toHaveBeenCalled();
    expect(component['setupResultCodeListener']).toHaveBeenCalledTimes(impositionsLength);
    expect(component.today).toBe('01/01/2022');
  });

  it('should update removeMinorCreditor in finesMacOffenceDetailsDraftState and call updateOffenceDetailsDraft and handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(0);

    component.minorCreditorActions({ action: 'remove', index: 0 });

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeMinorCreditor], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should update removeMinorCreditor in finesMacOffenceDetailsDraftState and call updateOffenceDetailsDraft and handleRoute addMinorCreditor', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    finesMacOffenceDetailsStore.setOffenceDetailsDraft(FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK.offenceDetailsDraft);
    finesMacOffenceDetailsStore.setRemoveMinorCreditor(0);

    component.minorCreditorActions({ action: 'change', index: 0 });

    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should update minorCreditorsHidden based on hidden imposition minor creditor', () => {
    component.minorCreditorsHidden = { 0: false };

    component.minorCreditorActions({ action: 'showHideDetails', index: 0 });

    expect(component.minorCreditorsHidden).toEqual({ 0: true });
  });

  it('should return the correct minor creditor form data for the specified row index', () => {
    const mockMinorCreditorForm = structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK);
    component.offenceIndex = 0;
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    finesMacState.offenceDetails[0].childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
    ];
    finesMacStore.setFinesMacStore(finesMacState);

    const result = component.getMinorCreditor(0);

    expect(result).toEqual(mockMinorCreditorForm);
  });

  it('should return undefined if childFormData is not defined', () => {
    component.offenceIndex = 0;
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];
    finesMacState.offenceDetails[0].childFormData = [];
    finesMacStore.setFinesMacStore(finesMacState);

    const result = component.getMinorCreditor(0);

    expect(result).toBeUndefined();
  });

  it('should return one item in the array of minor creditors', () => {
    const offenceWithMinorCreditor = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    offenceWithMinorCreditor.childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 1,
        },
      },
    ];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([offenceWithMinorCreditor]);

    component['removeMinorCreditorData'](0);

    expect(finesMacOffenceDetailsStore.offenceDetailsDraft()[0].childFormData!.length).toBe(1);
  });

  it('should remove the minor creditor at the specified index', () => {
    component.minorCreditors = { 0: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK };
    component['removeMinorCreditorFromState'](0);
    expect(component.minorCreditors[0]).toBeUndefined();
  });

  it('should not remove any minor creditor if the index does not exist', () => {
    component.minorCreditors = {
      0: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK,
      1: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_STATE_MOCK,
    };
    component['removeMinorCreditorFromState'](0);
    expect(component.minorCreditors[0]).toBeUndefined();
    expect(component.minorCreditors[1]).toBeDefined();
  });

  it('should retrieve minor creditors from offence details', () => {
    const mockOffenceDetails = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    mockOffenceDetails.childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 1,
        },
      },
    ];
    finesMacStore.setFinesMacStore({
      ...FINES_MAC_STATE_MOCK,
      offenceDetails: [mockOffenceDetails],
    });
    component.offenceIndex = 0;

    component.getMinorCreditors();

    expect(component.minorCreditors).toEqual({
      0: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData,
      1: {
        ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData,
        fm_offence_details_imposition_position: 1,
      },
    });
    expect(component.minorCreditorsHidden).toEqual({
      0: true,
      1: true,
    });
  });

  it('should retrieve minor creditors from draft offence details', () => {
    const mockDraftOffenceDetails = structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK);
    mockDraftOffenceDetails.childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 1,
        },
      },
    ];
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([mockDraftOffenceDetails]);

    component.getMinorCreditors();

    expect(component.minorCreditors).toEqual({
      0: FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData,
      1: {
        ...FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData,
        fm_offence_details_imposition_position: 1,
      },
    });
    expect(component.minorCreditorsHidden).toEqual({
      0: true,
      1: true,
    });
  });

  it('should set minorCreditors and minorCreditorsHidden to empty objects if no minor creditors are found', () => {
    finesMacStore.setFinesMacStore({
      ...FINES_MAC_STATE_MOCK,
      offenceDetails: [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)],
    });
    finesMacOffenceDetailsStore.setOffenceDetailsDraft([]);

    component.getMinorCreditors();

    expect(component.minorCreditors).toEqual({});
    expect(component.minorCreditorsHidden).toEqual({});
  });
});
