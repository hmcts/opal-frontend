import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacParentGuardianDetailsComponent } from './fines-mac-parent-guardian-details.component';
import { IFinesMacParentGuardianDetailsForm } from './interfaces/fines-mac-parent-guardian-details-form.interface';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from './mocks/fines-mac-parent-guardian-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';

describe('FinesMacParentGuardianDetailsComponent', () => {
  let component: FinesMacParentGuardianDetailsComponent;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacParentGuardianDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    formSubmit = { ...FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK };

    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsComponent],
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

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    formSubmit.nestedFlow = false;
    component.handleParentGuardianDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.parentGuardianDetails).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should handle form submission and navigate', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.defendantType = 'parentOrGuardianToPay';

    formSubmit.nestedFlow = true;
    component.handleParentGuardianDetailsSubmit(formSubmit);

    expect(mockFinesService.finesMacState.parentGuardianDetails).toEqual(formSubmit);
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
