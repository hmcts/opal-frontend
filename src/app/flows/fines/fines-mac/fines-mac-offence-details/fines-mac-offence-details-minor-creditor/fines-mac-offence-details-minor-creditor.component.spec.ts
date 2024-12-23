import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsMinorCreditorComponent } from './fines-mac-offence-details-minor-creditor.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IFinesMacOffenceDetailsMinorCreditorForm } from './interfaces/fines-mac-offence-details-minor-creditor-form.interface';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from './mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../constants/fines-mac-offence-details-draft-state.constant';

describe('FinesMacOffenceDetailsMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService> | null;
  let formSubmit: IFinesMacOffenceDetailsMinorCreditorForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService!.finesMacOffenceDetailsDraftState = structuredClone(
      FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE,
    );

    formSubmit = structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsMinorCreditorComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsMinorCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    mockFinesMacOffenceDetailsService = null;
    formSubmit = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission when editing and navigate to add an offence', () => {
    if (!component || !mockFinesService || !mockFinesMacOffenceDetailsService || !formSubmit || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];
    formSubmit.nestedFlow = false;

    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
    ];
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = 0;

    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(
      mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData.length,
    ).toEqual(1);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission when editing and navigate to add an offence multiple childFormData', () => {
    if (!component || !mockFinesService || !mockFinesMacOffenceDetailsService || !formSubmit || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];
    formSubmit.nestedFlow = false;

    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK),
        formData: {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK.formData),
          fm_offence_details_imposition_position: 1,
        },
      },
    ];
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = 0;

    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(
      mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData.length,
    ).toEqual(2);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to add an offence', () => {
    if (!component || !mockFinesService || !mockFinesMacOffenceDetailsService || !formSubmit || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];
    formSubmit.nestedFlow = false;

    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
    };
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.removeMinorCreditor = null;
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [];

    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft.length).toEqual(1);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
