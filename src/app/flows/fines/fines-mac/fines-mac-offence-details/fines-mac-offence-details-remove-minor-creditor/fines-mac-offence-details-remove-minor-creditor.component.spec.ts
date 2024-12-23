import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsRemoveMinorCreditorComponent } from './fines-mac-offence-details-remove-minor-creditor.component';
import { UtilsService } from '@services/utils/utils.service';
import { FinesMacOffenceDetailsService } from '../services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK } from '../mocks/fines-mac-offence-details-draft-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK } from '../fines-mac-offence-details-minor-creditor/mocks/fines-mac-offence-details-minor-creditor-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';

describe('FinesMacOffenceDetailsRemoveMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsRemoveMinorCreditorComponent | null;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveMinorCreditorComponent> | null;
  let mockUtilsService: jasmine.SpyObj<UtilsService> | null;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService> | null;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    // Cannot use structuredClone as FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK contains
    // Angular-specific objects (FormArray, FormGroup, FormControl) that include methods
    // and metadata, which structuredClone does not support.
    mockFinesMacOffenceDetailsService!.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
      offenceDetailsDraft: [
        {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
          childFormData: [{ ...structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK) }],
        },
      ],
    };

    mockUtilsService = jasmine.createSpyObj(UtilsService, ['formatSortCode', 'upperCaseFirstLetter']);

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveMinorCreditorComponent],
      providers: [
        { provide: FinesMacOffenceDetailsService, useValue: mockFinesMacOffenceDetailsService },
        { provide: UtilsService, useValue: mockUtilsService },
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

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveMinorCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesMacOffenceDetailsService = null;
    mockUtilsService = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find the index of a minor creditor with the given imposition position', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const actualIndex = component['findMinorCreditorIndex'](0);

    expect(actualIndex).toBe(0);
  });

  it('should remove minor creditor when confirmMinorCreditorRemoval is called', () => {
    if (!component || !mockFinesMacOffenceDetailsService) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component.confirmMinorCreditorRemoval();

    expect(
      mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData,
    ).not.toContain(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
      relativeTo: component['activatedRoute'].parent,
    });
  });
});
