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

describe('FinesMacOffenceDetailsMinorCreditorComponent', () => {
  let component: FinesMacOffenceDetailsMinorCreditorComponent;
  let fixture: ComponentFixture<FinesMacOffenceDetailsMinorCreditorComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockFinesMacOffenceDetailsService: jasmine.SpyObj<FinesMacOffenceDetailsService>;
  let formSubmit: IFinesMacOffenceDetailsMinorCreditorForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    mockFinesMacOffenceDetailsService = jasmine.createSpyObj(FinesMacOffenceDetailsService, [
      'finesMacOffenceDetailsDraftState',
    ]);

    formSubmit = FINES_MAC_OFFENCE_DETAILS_MINOR_CREDITOR_FORM_MOCK;

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    mockFinesService.finesMacState.offenceDetails = [];
    formSubmit.nestedFlow = false;

    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE_MOCK;
    mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft[0].childFormData = [];
    component.handleMinorCreditorFormSubmit(formSubmit);
    fixture.detectChanges();

    expect(mockFinesMacOffenceDetailsService.finesMacOffenceDetailsDraftState.offenceDetailsDraft.length).toEqual(1);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence], {
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
