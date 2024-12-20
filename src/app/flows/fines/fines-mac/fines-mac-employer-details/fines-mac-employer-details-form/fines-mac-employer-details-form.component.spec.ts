import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacEmployerDetailsFormComponent } from './fines-mac-employer-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacEmployerDetailsForm } from '../interfaces/fines-mac-employer-details-form.interface';
import { FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK } from '../mocks/fines-mac-employer-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { of } from 'rxjs';

describe('FinesMacEmployerDetailsFormComponent', () => {
  let component: FinesMacEmployerDetailsFormComponent | null;
  let fixture: ComponentFixture<FinesMacEmployerDetailsFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacEmployerDetailsForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    formSubmit = { ...FINES_MAC_EMPLOYER_DETAILS_FORM_MOCK };

    await TestBed.configureTestingModule({
      imports: [FinesMacEmployerDetailsFormComponent],
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

    fixture = TestBed.createComponent(FinesMacEmployerDetailsFormComponent);
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

  it('should emit form submit event with form value - continue flow', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
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

  it('should emit form submit event with form value', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
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

  it('should call initialCreateAccountSetup method', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupEmployerDetailsForm');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setInitialErrorMessages');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'rePopulateForm');

    component['initialEmployerDetailsSetup']();

    expect(component['setupEmployerDetailsForm']).toHaveBeenCalled();
    expect(component['setInitialErrorMessages']).toHaveBeenCalled();
    expect(component['rePopulateForm']).toHaveBeenCalledWith(mockFinesService.finesMacState.employerDetails.formData);
  });
});
