import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacContactDetailsFormComponent } from './fines-mac-contact-details-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacContactDetailsForm } from '../interfaces/fines-mac-contact-details-form.interface';
import { FINES_MAC_STATE_MOCK } from '../../mocks/fines-mac-state.mock';
import { FINES_MAC_CONTACT_DETAILS_FORM_MOCK } from '../mocks/fines-mac-contact-details-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesMacContactDetailsFormComponent', () => {
  let component: FinesMacContactDetailsFormComponent | null;
  let fixture: ComponentFixture<FinesMacContactDetailsFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacContactDetailsForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE_MOCK);

    formSubmit = structuredClone(FINES_MAC_CONTACT_DETAILS_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacContactDetailsFormComponent],
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

    fixture = TestBed.createComponent(FinesMacContactDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
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

  it('should emit form submit event with form value', () => {
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
});
