import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacAccountCommentsNotesFormComponent } from './fines-mac-account-comments-notes-form.component';
import { IFinesMacAccountCommentsNotesForm } from '../interfaces/fines-mac-account-comments-notes-form.interface';
import { ActivatedRoute } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK } from '../mocks/fines-mac-account-comments-notes-form.mock';
import { FINES_MAC_STATUS } from '../../constants/fines-mac-status';
import { FINES_MAC_OFFENCE_DETAILS_FORM } from '../../fines-mac-offence-details/constants/fines-mac-offence-details-form.constant';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { of } from 'rxjs';

describe('FinesMacAccountCommentsNotesFormComponent', () => {
  let component: FinesMacAccountCommentsNotesFormComponent | null;
  let fixture: ComponentFixture<FinesMacAccountCommentsNotesFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacAccountCommentsNotesForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    formSubmit = structuredClone(FINES_MAC_ACCOUNT_COMMENTS_NOTES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacAccountCommentsNotesFormComponent],
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

    fixture = TestBed.createComponent(FinesMacAccountCommentsNotesFormComponent);
    component = fixture.componentInstance;
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

  it('should emit form submit event with form value - nestedFlow true', () => {
    if (!component || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value - nestedFlow false', () => {
    if (!component || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    component.defendantType = 'adultOrYouthOnly';
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });

  it('should return true if all mandatory sections have been provided', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.courtDetails = {
      ...structuredClone(mockFinesService.finesMacState.courtDetails),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.personalDetails = {
      ...structuredClone(mockFinesService.finesMacState.personalDetails),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.employerDetails = {
      ...structuredClone(mockFinesService.finesMacState.employerDetails),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.offenceDetails = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM)];
    mockFinesService.finesMacState.offenceDetails[0] = {
      ...structuredClone(mockFinesService.finesMacState.offenceDetails[0]),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.paymentTerms = {
      ...structuredClone(mockFinesService.finesMacState.paymentTerms),
      status: FINES_MAC_STATUS.PROVIDED,
    };

    const result = component['checkMandatorySections']();

    expect(result).toBe(true);
  });

  it('should return false if any mandatory section is missing', () => {
    if (!component || !mockFinesService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockFinesService.finesMacState.courtDetails = {
      ...structuredClone(mockFinesService.finesMacState.courtDetails),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.personalDetails = {
      ...structuredClone(mockFinesService.finesMacState.personalDetails),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.employerDetails = {
      ...structuredClone(mockFinesService.finesMacState.employerDetails),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.offenceDetails = [...structuredClone(FINES_MAC_OFFENCE_DETAILS_FORM)];
    mockFinesService.finesMacState.offenceDetails[0] = {
      ...structuredClone(mockFinesService.finesMacState.offenceDetails[0]),
      status: FINES_MAC_STATUS.PROVIDED,
    };
    mockFinesService.finesMacState.paymentTerms = {
      ...structuredClone(mockFinesService.finesMacState.paymentTerms),
      status: FINES_MAC_STATUS.NOT_PROVIDED,
    };

    const result = component['checkMandatorySections']();

    expect(result).toBe(false);
  });
});
