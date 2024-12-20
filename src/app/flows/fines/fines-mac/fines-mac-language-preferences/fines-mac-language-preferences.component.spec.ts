import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacLanguagePreferencesComponent } from './fines-mac-language-preferences.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacLanguagePreferencesForm } from './interfaces/fines-mac-language-preferences-form.interface';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK } from './mocks/fines-mac-language-preferences-form.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';

describe('FinesMacLanguagePreferencesComponent', () => {
  let component: FinesMacLanguagePreferencesComponent | null;
  let fixture: ComponentFixture<FinesMacLanguagePreferencesComponent> | null;
  let mockFinesService: jasmine.SpyObj<FinesService> | null;
  let formSubmit: IFinesMacLanguagePreferencesForm | null;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState']);
    mockFinesService!.finesMacState = structuredClone(FINES_MAC_STATE);

    formSubmit = structuredClone(FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacLanguagePreferencesComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacLanguagePreferencesComponent);
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

  it('should handle form submission and navigate to account details', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleLanguagePreferencesSubmit(formSubmit);

    expect(mockFinesService.finesMacState.languagePreferences).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    if (!component || !mockFinesService || !fixture || !formSubmit) {
      fail('Required properties not properly initialised');
      return;
    }

    component.handleUnsavedChanges(true);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
