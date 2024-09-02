import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacLanguagePreferencesFormComponent } from './fines-mac-language-preferences-form.component';
import { FinesService } from '../../../services/fines-service/fines.service';
import { IFinesMacLanguagePreferencesForm } from '../interfaces';
import { FINES_MAC_STATE_MOCK } from '../../mocks';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK } from '../mocks';
import { ActivatedRoute } from '@angular/router';

describe('FinesMacLanguagePreferencesFormComponent', () => {
  let component: FinesMacLanguagePreferencesFormComponent;
  let fixture: ComponentFixture<FinesMacLanguagePreferencesFormComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let formSubmit: IFinesMacLanguagePreferencesForm;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj('macStateService', ['manualAccountCreation']);

    mockFinesService.finesMacState = FINES_MAC_STATE_MOCK;

    formSubmit = FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK;

    await TestBed.configureTestingModule({
      imports: [FinesMacLanguagePreferencesFormComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacLanguagePreferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});