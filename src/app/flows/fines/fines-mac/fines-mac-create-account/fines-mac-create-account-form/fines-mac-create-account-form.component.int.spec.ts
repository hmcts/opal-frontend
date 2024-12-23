import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacCreateAccountFormComponent } from './fines-mac-create-account-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovukErrorSummaryComponent } from '@components/govuk/govuk-error-summary/govuk-error-summary.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FINES_MAC_ACCOUNT_TYPES } from '../../constants/fines-mac-account-types';

describe('FinesMacCreateAccountFormComponent', () => {
  let component: FinesMacCreateAccountFormComponent | null;
  let fixture: ComponentFixture<FinesMacCreateAccountFormComponent> | null;

  beforeEach(async () => {
    // Setting up the TestBed to configure the testing environment for the component,
    // including its dependencies and modules.
    await TestBed.configureTestingModule({
      imports: [FinesMacCreateAccountFormComponent, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacCreateAccountFormComponent);
    component = fixture.componentInstance;

    // Initialise autoCompleteItems with a default value to simulate dropdown data for the tests.
    component.autoCompleteItems = [{ value: 1, name: 'Business Unit A' }];
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should show error summary if form is invalid', () => {
    if (!component || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    // Sets up the form in an invalid state to test the visibility of the error summary.
    component.form.controls['fm_create_account_business_unit_id'].setValue('');
    component.form.controls['fm_create_account_account_type'].setValue(null);
    fixture.detectChanges();

    const errorSummary = fixture.debugElement.query(By.directive(GovukErrorSummaryComponent));
    expect(errorSummary).toBeTruthy();
  });

  it('should render appropriate template for single autocomplete item', () => {
    if (!component || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    // Initializes the autoCompleteItems property to simulate data input for the test.
    component.autoCompleteItems = [{ value: 1, name: 'Business Unit A' }];
    fixture.detectChanges();

    const paragraph = fixture.debugElement.query(By.css('p'));
    expect(paragraph).toBeTruthy();
    expect(paragraph.nativeElement.textContent).toContain('The account will be created in Business Unit A');
  });

  it('should emit formSubmit event on form submission', () => {
    if (!component || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    // The spy is used to monitor and verify the emission of the formSubmit event.
    const emitSpy = spyOn(component['formSubmit'], 'emit');

    // Sets a valid value for the business unit ID control to prepare the form for submission testing.
    component.form.controls['fm_create_account_business_unit_id'].setValue(123);
    component.form.controls['fm_create_account_account_type'].setValue('fine');
    component.form.controls['fm_create_account_defendant_type'].setValue('fine');
    component.form.controls['fm_create_account_fine_defendant_type'].setValue('fine');

    // Ensure the form is valid
    expect(component.form.valid).toBeTrue();

    // Detect changes to update the form's state
    fixture.detectChanges();

    // Create a mock submit event
    const mockSubmitEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      submitter: { className: 'nested-flow' }, // Add a className property
    };

    // Simulates the form submission event with a mock event to test the handling logic.
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy(); // Ensure the form exists
    form.triggerEventHandler('submit', mockSubmitEvent);

    // Validates that the formSubmit event is emitted with the correct payload, including nestedFlow information.
    expect(emitSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formData: {
          fm_create_account_business_unit_id: 123,
          fm_create_account_account_type: 'fine',
          fm_create_account_defendant_type: 'fine',
          fm_create_account_fine_defendant_type: 'fine',
        },
        nestedFlow: true, // Expect nestedFlow to be true due to className
      }),
    );
  });

  it('should display error messages when form controls are invalid', () => {
    if (!component || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    component.form.controls['fm_create_account_business_unit_id'].setErrors({ required: true });
    component.form.controls['fm_create_account_account_type'].setErrors({ required: true });
    fixture.detectChanges();

    const errorSummary = fixture.debugElement.query(By.css('app-govuk-error-summary'));
    expect(errorSummary).toBeTruthy();
  });

  it('should render the correct defendant types based on account type', () => {
    if (!component || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

    component.form.controls['fm_create_account_account_type'].setValue('fine');
    fixture.detectChanges();

    const radios = fixture.debugElement.queryAll(By.css('[app-govuk-radios-item]'));
    expect(radios.length).toBe(3);
    expect(radios[0].nativeElement.textContent).toContain(FINES_MAC_ACCOUNT_TYPES.fine);
    expect(radios[1].nativeElement.textContent).toContain(FINES_MAC_ACCOUNT_TYPES.fixedPenalty);
    expect(radios[2].nativeElement.textContent).toContain(FINES_MAC_ACCOUNT_TYPES.conditionalCaution);
  });
});
