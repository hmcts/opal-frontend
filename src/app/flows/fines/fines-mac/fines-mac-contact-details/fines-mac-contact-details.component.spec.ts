import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacContactDetailsComponent } from './fines-mac-contact-details.component';
import { IFinesMacContactDetailsForm } from './interfaces/fines-mac-contact-details-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_CONTACT_DETAILS_FORM_MOCK } from './mocks/fines-mac-contact-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_CONTACT_DETAILS_STATE } from './constants/fines-mac-contact-details-state';

describe('FinesMacContactDetailsComponent', () => {
  let component: FinesMacContactDetailsComponent | null;
  let fixture: ComponentFixture<FinesMacContactDetailsComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacContactDetailsForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

    formSubmit = structuredClone(FINES_MAC_CONTACT_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacContactDetailsComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacContactDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockFinesService = null;
    formSubmit = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handleContactDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.contactDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleContactDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.contactDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.employerDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to next route - form empty', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    const form: IFinesMacContactDetailsForm = {
      formData: FINES_MAC_CONTACT_DETAILS_STATE,
      nestedFlow: true,
    };

    component.handleContactDetailsSubmit(form);

    expect(mockFinesService.finesMacState.contactDetails).toEqual(form);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.employerDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
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
