import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacPersonalDetailsComponent } from './fines-mac-personal-details.component';
import { IFinesMacPersonalDetailsForm } from './interfaces/fines-mac-personal-details-form.interface';
import { FinesService } from '@services/fines/fines-service/fines';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_PERSONAL_DETAILS_FORM_MOCK } from './mocks/fines-mac-personal-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';

describe('FinesMacPersonalDetailsComponent', () => {
  let component: FinesMacPersonalDetailsComponent;
  let fixture: ComponentFixture<FinesMacPersonalDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacPersonalDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    formSubmit = FINES_MAC_PERSONAL_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacPersonalDetailsComponent],
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

    fixture = TestBed.createComponent(FinesMacPersonalDetailsComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.personalDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate next route', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handlePersonalDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.personalDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.contactDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(mockFinesService.finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
