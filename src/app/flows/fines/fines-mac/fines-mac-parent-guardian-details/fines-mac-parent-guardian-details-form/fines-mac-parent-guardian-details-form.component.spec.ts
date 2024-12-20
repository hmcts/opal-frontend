import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces/fines-mac-parent-guardian-details-form.interface';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from '../mocks/fines-mac-parent-guardian-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { DateService } from '@services/date-service/date.service';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { of } from 'rxjs';

describe('FinesMacParentGuardianDetailsFormComponent', () => {
  let component: FinesMacParentGuardianDetailsFormComponent | null;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let mockDateService: jasmine.SpyObj<DateService> | null;
  let formSubmit: IFinesMacParentGuardianDetailsForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    mockDateService = jasmine.createSpyObj(DateService, ['getPreviousDate']);

    formSubmit = structuredClone(FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: DateService, useValue: mockDateService },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsFormComponent);
    component = fixture.componentInstance;

    mockDateService!.getPreviousDate.and.returnValue('19/08/2024');
    mockFinesService!.finesMacState.accountDetails.formData = {
      ...mockFinesService!.finesMacState.accountDetails.formData,
      fm_create_account_defendant_type: 'parentOrGuardianToPay',
    };

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

  it('should emit form submit event with form value', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit || !mockDateService) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component['formSubmit'], 'emit');
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;

    formSubmit.nestedFlow = true;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: true,
      }),
    );
  });

  it('should emit form submit event with form value', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit || !mockDateService) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    formSubmit.nestedFlow = false;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: formSubmit.formData,
        nestedFlow: false,
      }),
    );
  });
});
