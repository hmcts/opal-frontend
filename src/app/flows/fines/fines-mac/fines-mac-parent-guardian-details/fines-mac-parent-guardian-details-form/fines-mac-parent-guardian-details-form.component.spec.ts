import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacParentGuardianDetailsFormComponent } from './fines-mac-parent-guardian-details-form.component';
import { FinesService } from '@services/fines';
import { IFinesMacParentGuardianDetailsForm } from '../interfaces';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK } from '../mocks';
import { ActivatedRoute } from '@angular/router';

describe('FinesMacParentGuardianDetailsFormComponent', () => {
  let component: FinesMacParentGuardianDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacParentGuardianDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  let formSubmit: IFinesMacParentGuardianDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_PARENT_GUARDIAN_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacParentGuardianDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacParentGuardianDetailsFormComponent);
    component = fixture.componentInstance;

    mockFinesService.finesMacState.accountDetails.defendant_type = 'parentOrGuardianToPay';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;

    formSubmit.nestedFlow = true;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    formSubmit.nestedFlow = false;
    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
