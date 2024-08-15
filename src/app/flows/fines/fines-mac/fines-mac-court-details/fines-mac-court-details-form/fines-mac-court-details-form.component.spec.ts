import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCourtDetailsFormComponent } from './fines-mac-court-details-form.component';
import { FinesService } from '@services/fines';
import { IFinesMacCourtDetailsForm } from '../interfaces';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import {
  OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK,
  OPAL_FINES_LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK,
} from '../../../services/opal-fines-service/mocks';
import { FINES_MAC_COURT_DETAILS_FORM_MOCK } from '../mocks';
import { ActivatedRoute } from '@angular/router';

describe('FinesMacCourtDetailsFormComponent', () => {
  let component: FinesMacCourtDetailsFormComponent;
  let fixture: ComponentFixture<FinesMacCourtDetailsFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacCourtDetailsForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('FinesService', ['finesMacState']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;
    formSubmit = FINES_MAC_COURT_DETAILS_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacCourtDetailsFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCourtDetailsFormComponent);
    component = fixture.componentInstance;

    component.defendantType = 'adultOrYouthOnly';
    component.sendingCourtAutoCompleteItems = OPAL_FINES_LOCAL_JUSTICE_AREA_AUTOCOMPLETE_ITEMS_MOCK;
    component.enforcingCourtAutoCompleteItems = OPAL_FINES_COURT_AUTOCOMPLETE_ITEMS_MOCK;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    formSubmit.nestedFlow = false;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });

  it('should emit form submit event with form value', () => {
    const event = { submitter: { className: 'nested-flow' } } as SubmitEvent;
    formSubmit.nestedFlow = true;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
