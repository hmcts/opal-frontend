import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCourtDetailsComponent } from './fines-mac-court-details.component';
import { IFinesMacCourtDetailsForm } from './interfaces/fines-mac-court-details-form.interface';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from './mocks/fines-mac-court-details-form.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-pretty-name.mock';
import { OPAL_FINES_COURT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-pretty-name.mock';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';

describe('FinesMacCourtDetailsComponent', () => {
  let component: FinesMacCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacCourtDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getLocalJusticeAreaPrettyName: jasmine
        .createSpy('getLocalJusticeAreaPrettyName')
        .and.returnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
      getCourtPrettyName: jasmine.createSpy('getCourtPrettyName').and.returnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
    };
    formSubmit = structuredClone(FINES_MAC_COURT_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacCourtDetailsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
            snapshot: {
              data: {
                courts: OPAL_FINES_COURT_REF_DATA_MOCK,
                localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCourtDetailsComponent);
    component = fixture.componentInstance;

    finesMacStore = TestBed.inject(FinesMacStore);
    finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleCourtDetailsSubmit(formSubmit);

    expect(finesMacStore.courtDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to personal details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleCourtDetailsSubmit(formSubmit);

    expect(finesMacStore.courtDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.personalDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(finesMacStore.unsavedChanges()).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(finesMacStore.unsavedChanges()).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
