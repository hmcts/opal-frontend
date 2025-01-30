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
  let component: FinesMacOffenceDetailsRemoveMinorCreditorComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveMinorCreditorComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;

  beforeEach(async () => {
    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
      offenceDetailsDraft: [
        {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
          childFormData: [structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK)],
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

  beforeEach(() => {
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = {
      ...FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK,
      offenceDetailsDraft: [
        {
          ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
          childFormData: [structuredClone(FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK)],
        },
      ],
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find the index of a minor creditor with the given imposition position', () => {
    const actualIndex = component['findMinorCreditorIndex'](0);

    expect(actualIndex).toBe(0);
  });

  it('should remove minor creditor when confirmMinorCreditorRemoval is called', () => {
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
