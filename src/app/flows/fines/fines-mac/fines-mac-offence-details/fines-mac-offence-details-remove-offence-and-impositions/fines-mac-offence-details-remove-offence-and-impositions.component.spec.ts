import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent } from './fines-mac-offence-details-remove-offence-and-impositions.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_OFFENCE_DETAILS_FORM_MOCK } from '../mocks/fines-mac-offence-details-form.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FinesMacStoreType } from '../../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../../stores/fines-mac.store';
import { FinesMacOffenceDetailsStoreType } from '../stores/types/fines-mac-offence-details.type';
import { FinesMacOffenceDetailsStore } from '../stores/fines-mac-offence-details.store';

describe('FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent', () => {
  let component: FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let finesMacStore: FinesMacStoreType;
  let finesMacOffenceDetailsStore: FinesMacOffenceDetailsStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
    };

    await TestBed.configureTestingModule({
      imports: [FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent],

      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('offence-details'),
            snapshot: {
              data: {
                results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
                majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent);
    component = fixture.componentInstance;

    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK)];

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(finesMacState);

    finesMacOffenceDetailsStore = TestBed.inject(FinesMacOffenceDetailsStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the offence and set offenceRemoved to true', () => {
    component.confirmOffenceRemoval();
    expect(finesMacStore.offenceDetails().length).toBe(0);
    expect(finesMacOffenceDetailsStore.offenceRemoved()).toBeTrue();
  });

  it('should navigate to reviewOffences route after removing offence', () => {
    spyOn(component, 'handleRoute');
    component.confirmOffenceRemoval();
    expect(component.handleRoute).toHaveBeenCalledWith(FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences);
  });

  it('should remove first item in array leaving one item remaining', () => {
    const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
    finesMacState.offenceDetails = [
      structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
      {
        ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK),
        formData: { ...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM_MOCK.formData), fm_offence_details_id: 1 },
      },
    ];
    finesMacStore.setFinesMacStore(finesMacState);

    component.confirmOffenceRemoval();

    expect(finesMacStore.offenceDetails().length).toBe(1);
  });
});
