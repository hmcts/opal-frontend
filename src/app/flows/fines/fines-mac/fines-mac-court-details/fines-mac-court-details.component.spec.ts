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
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from './mocks/fines-mac-court-details-form.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths.constant';
import { FINES_MAC_ROUTING_NESTED_ROUTES } from '../routing/constants/fines-mac-routing-nested-routes.constant';
import { OPAL_FINES_COURT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-pretty-name.mock';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../constants/fines-mac-defendant-types-keys';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK,
  FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK,
} from '../routing/resolvers/fetch-originators-resolver/mocks/fines-mac-originator-ref-data.mock';

describe('FinesMacCourtDetailsComponent', () => {
  let component: FinesMacCourtDetailsComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsComponent>;
  let mockOpalFinesService: Partial<OpalFines>;
  let formSubmit: IFinesMacCourtDetailsForm;
  let finesMacStore: FinesMacStoreType;

  beforeEach(async () => {
    mockOpalFinesService = {
      getCourtPrettyName: vi.fn().mockReturnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
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
                originators: FINES_MAC_LJA_ORIGINATOR_REF_DATA_MOCK,
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

    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create sending police force autocomplete items from prosecutors', () => {
    const autocompleteItems = component['createAutoCompleteItemsOriginators'](
      FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK,
    );

    expect(autocompleteItems).toHaveLength(FINES_MAC_PROSECUTOR_ORIGINATOR_REF_DATA_MOCK.refData.length);
    expect(autocompleteItems[0]).toEqual({ value: 1865, name: 'Central ticket office (998)' });
  });

  it('should handle form submission and navigate to account details', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleCourtDetailsSubmit(formSubmit);

    expect(finesMacStore.courtDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to personal details', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleCourtDetailsSubmit(formSubmit);

    expect(finesMacStore.courtDetails()).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.personalDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should not navigate when nested flow has no configured next route', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routerSpy = vi.spyOn<any, any>(component['router'], 'navigate');
    const originalRoute = FINES_MAC_ROUTING_NESTED_ROUTES[FINES_MAC_DEFENDANT_TYPES_KEYS.company].courtDetails;
    component.defendantType = FINES_MAC_DEFENDANT_TYPES_KEYS.company;
    formSubmit.nestedFlow = true;
    FINES_MAC_ROUTING_NESTED_ROUTES[FINES_MAC_DEFENDANT_TYPES_KEYS.company].courtDetails = null;

    try {
      component.handleCourtDetailsSubmit(formSubmit);

      expect(finesMacStore.courtDetails()).toEqual(formSubmit);
      expect(routerSpy).not.toHaveBeenCalled();
    } finally {
      FINES_MAC_ROUTING_NESTED_ROUTES[FINES_MAC_DEFENDANT_TYPES_KEYS.company].courtDetails = originalRoute;
    }
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
