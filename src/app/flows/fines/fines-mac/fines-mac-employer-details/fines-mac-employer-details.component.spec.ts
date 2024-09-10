import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacEmployerDetailsComponent } from './fines-mac-employer-details.component';
import { IFinesMacEmployerDetailsForm } from './interfaces/fines-mac-employer-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FinesService } from '@services/fines';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from './mocks/fines-mac-employer-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';

describe('FinesMacEmployerDetailsComponent', () => {
  let component: FinesMacEmployerDetailsComponent;
  let fixture: ComponentFixture<FinesMacEmployerDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacEmployerDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsComponent],
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

    fixture = TestBed.createComponent(FinesMacEmployerDetailsComponent);
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

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.employerDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to offence details - adult or youth only', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = true;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.employerDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.offenceDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate to personal details - parent or guardian to pay', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = 'parentOrGuardianToPay';
    formSubmit.nestedFlow = true;

    component.handleEmployerDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.employerDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.personalDetails], {
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
