import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesMacLanguagePreferencesComponent } from './fines-mac-language-preferences.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { IFinesMacLanguagePreferencesForm } from './interfaces/fines-mac-language-preferences-form.interface';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK } from './mocks/fines-mac-language-preferences-form.mock';
import { FINES_MAC_ROUTING_PATHS } from '../routing/constants/fines-mac-routing-paths';

describe('FinesMacLanguagePreferencesComponent', () => {
  let component: FinesMacLanguagePreferencesComponent;
  let fixture: ComponentFixture<FinesMacLanguagePreferencesComponent>;
  let finesService: jasmine.SpyObj<FinesService>;
  let formSubmit: IFinesMacLanguagePreferencesForm;

  beforeEach(async () => {
    finesService = jasmine.createSpyObj(FinesService, ['finesMacState']);

    finesService.finesMacState = { ...FINES_MAC_STATE_MOCK };

    formSubmit = { ...FINES_MAC_LANGUAGE_PREFERENCES_FORM_MOCK };

    await TestBed.configureTestingModule({
      imports: [FinesMacLanguagePreferencesComponent],
      providers: [
        { provide: FinesService, useValue: finesService },
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission and navigate to account details', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleLanguagePreferencesSubmit(formSubmit);

    expect(finesService.finesMacState.languagePreferences).toEqual(formSubmit);
    expect(routerSpy).toHaveBeenCalledWith([FINES_MAC_ROUTING_PATHS.children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test handleUnsavedChanges', () => {
    component.handleUnsavedChanges(true);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeTruthy();
    expect(component.stateUnsavedChanges).toBeTruthy();

    component.handleUnsavedChanges(false);
    expect(component['finesService'].finesMacState.unsavedChanges).toBeFalsy();
    expect(component.stateUnsavedChanges).toBeFalsy();
  });
});
