import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacLanguagePreferencesFormComponent } from './fines-mac-language-preferences-form.component';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacLanguagePreferencesForm } from '../interfaces/fines-mac-language-preferences-form.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK } from '../mocks/fines-mac-language-preferences-form.mock';
import { ActivatedRoute } from '@angular/router';
import { FINES_MAC_STATE } from '../../constants/fines-mac-state';
import { of } from 'rxjs';

describe('FinesMacLanguagePreferencesFormComponent', () => {
  let component: FinesMacLanguagePreferencesFormComponent | null;
  let fixture: ComponentFixture<FinesMacLanguagePreferencesFormComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacLanguagePreferencesForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    formSubmit = structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacLanguagePreferencesFormComponent],
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

    fixture = TestBed.createComponent(FinesMacLanguagePreferencesFormComponent);
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

  it('should emit form submit event with form value', () => {
    if (!component || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component['formSubmit'], 'emit');
    const event = {} as SubmitEvent;

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formSubmit);
  });
});
