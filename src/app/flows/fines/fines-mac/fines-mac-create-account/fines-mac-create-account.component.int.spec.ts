import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountComponent } from './fines-mac-create-account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form/fines-mac-create-account-form.component';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_MAC_CREATE_ACCOUNT_FORM_MOCK } from './mocks/fines-mac-create-account-form.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-autocomplete-items.mock';

describe('FinesMacCreateAccountComponent', () => {
  let component: FinesMacCreateAccountComponent | null;
  let fixture: ComponentFixture<FinesMacCreateAccountComponent> | null;
  let mockOpalFinesService: Partial<OpalFines> | null;

  beforeEach(async () => {
    // Mocking the OpalFinesService to return predefined data for tests.
    mockOpalFinesService = {
      getBusinessUnits: jasmine
        .createSpy('getBusinessUnits')
        .and.returnValue(of(structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK))),
    };

    // Configuring the TestBed to set up the testing environment for the FinesMacCreateAccountComponent.
    // This includes necessary imports, providers, and mocked services.
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FinesMacCreateAccountComponent, FinesMacCreateAccountFormComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
        { provide: OpalFines, useValue: mockOpalFinesService }, // Mocked service
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountComponent);
    component = fixture.componentInstance;

    // Initializing required inputs or setting the default state for testing.
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    mockOpalFinesService = null;
    TestBed.resetTestingModule();
  });

  it('should render the child form component', async () => {
    if (!fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    fixture.detectChanges();
    await fixture.whenStable(); // Ensures all asynchronous tasks are complete before proceeding.

    // Retrieves the child form component for validation.
    const formComponent = fixture.debugElement.query(By.directive(FinesMacCreateAccountFormComponent));
    expect(formComponent).toBeTruthy();
  });

  it('should pass data to the form component', async () => {
    if (!component || !mockOpalFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    // Mocking the service to emit valid data.
    (mockOpalFinesService.getBusinessUnits as jasmine.Spy).and.returnValue(
      of(structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK)),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    // Validate child component data binding.
    const formComponent = fixture.debugElement.query(By.directive(FinesMacCreateAccountFormComponent));
    expect(formComponent).toBeTruthy(); // Ensures the form component exists.
    expect(formComponent.componentInstance.autoCompleteItems).toEqual(
      component['createAutoCompleteItems'](OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK),
    );
  });

  it('should handle form submission', async () => {
    if (!component || !mockOpalFinesService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    spyOn(component, 'handleAccountDetailsSubmit'); // Spying on the form submission handler.

    // Mocking the service to ensure the child component renders.
    (mockOpalFinesService.getBusinessUnits as jasmine.Spy).and.returnValue(
      of(structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK)),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    // Retrieves the child form component.
    const formComponent = fixture.debugElement.query(By.directive(FinesMacCreateAccountFormComponent));
    expect(formComponent).toBeTruthy();

    // Simulates the form submission event.
    formComponent.triggerEventHandler('formSubmit', structuredClone(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK));
    expect(component.handleAccountDetailsSubmit).toHaveBeenCalledWith(FINES_MAC_CREATE_ACCOUNT_FORM_MOCK);
  });

  it('should transform refData to autoCompleteItems correctly', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const mockResponse = structuredClone(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
    // Validates the transformation logic for autoCompleteItems.
    const result = component['createAutoCompleteItems'](mockResponse);
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_AUTOCOMPLETE_ITEMS_MOCK);
  });
});
