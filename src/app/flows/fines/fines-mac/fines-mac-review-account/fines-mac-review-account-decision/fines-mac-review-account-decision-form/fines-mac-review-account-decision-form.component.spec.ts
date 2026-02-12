import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountDecisionFormComponent } from './fines-mac-review-account-decision-form.component';
import { IFinesMacReviewAccountDecisionForm } from '../interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK } from '../mocks/fines-mac-review-account-decision-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GovukRadioComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacReviewAccountDecisionFormComponent', () => {
  let component: FinesMacReviewAccountDecisionFormComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountDecisionFormComponent>;
  let formSubmit: IFinesMacReviewAccountDecisionForm;
  let originalInitOuterRadios: () => void;

  beforeAll(() => {
    originalInitOuterRadios = GovukRadioComponent.prototype['initOuterRadios'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(GovukRadioComponent.prototype, 'initOuterRadios').mockImplementation(() => {});
  });

  afterAll(() => {
    GovukRadioComponent.prototype['initOuterRadios'] = originalInitOuterRadios;
  });

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');
    formSubmit = structuredClone(FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountDecisionFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('draft'),
            fragment: 'to-review',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountDecisionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');

    component['rePopulateForm'](formSubmit.formData);

    component.handleFormSubmit(event);

    expect(component['formSubmit'].emit).toHaveBeenCalled();
  });

  it('should initialize the form with correct controls and validators', () => {
    expect(component.form.contains('fm_review_account_decision')).toBe(true);
    expect(component.form.get('fm_review_account_decision_reason')).toBeTruthy();

    const decisionControl = component.form.get('fm_review_account_decision');
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');

    decisionControl?.setValue(null);
    expect(decisionControl?.valid).toBe(false);
    decisionControl?.setValue('approve');
    expect(decisionControl?.valid).toBe(true);

    expect(rejectionReasonControl?.disabled).toBe(true);
  });

  it('should add required validator to rejection reason when decision is reject', () => {
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');
    const decisionControl = component.form.get('fm_review_account_decision');

    decisionControl?.setValue('reject');
    fixture.detectChanges();

    expect(rejectionReasonControl?.enabled).toBe(true);
    rejectionReasonControl?.setValue('');
    rejectionReasonControl?.markAsTouched();
    expect(rejectionReasonControl?.hasError('required')).toBe(true);

    rejectionReasonControl?.setValue('Valid reason');
    expect(rejectionReasonControl?.valid).toBe(true);
  });

  it('should remove required validator from rejection reason when decision is not reject', () => {
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');
    const decisionControl = component.form.get('fm_review_account_decision');

    decisionControl?.setValue('reject');
    fixture.detectChanges();
    rejectionReasonControl?.setValue('');
    expect(rejectionReasonControl?.hasError('required')).toBe(true);

    decisionControl?.setValue('approve');
    fixture.detectChanges();
    expect(rejectionReasonControl?.disabled).toBe(true);
    expect(rejectionReasonControl?.hasError('required')).toBe(false);
  });

  it('should reset rejection reason control and update validity on decision change', () => {
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');
    const decisionControl = component.form.get('fm_review_account_decision');

    rejectionReasonControl?.setValue('Some value');
    decisionControl?.setValue('reject');
    fixture.detectChanges();
    expect(rejectionReasonControl?.value).toBeNull();
    expect(rejectionReasonControl?.valid).toBe(false);

    rejectionReasonControl?.setValue('Another value');
    decisionControl?.setValue('approve');
    fixture.detectChanges();
    expect(rejectionReasonControl?.value).toBeNull();
    expect(rejectionReasonControl?.disabled).toBe(true);
  });

  it('should show the reject conditional only when reject is selected', async () => {
    await fixture.whenStable();
    const conditional = fixture.nativeElement.querySelector(`#${component.decisionRejectConditionalId}`);
    expect(conditional).toBeTruthy();
    expect(conditional.classList.contains('govuk-radios__conditional--hidden')).toBe(true);

    const rejectInput = fixture.nativeElement.querySelector(
      `input[aria-controls="${component.decisionRejectConditionalId}"]`,
    );
    rejectInput.click();
    fixture.detectChanges();
    expect(component.form.get('fm_review_account_decision_reason')?.enabled).toBe(true);
  });

  it('should call initialDecisionFormSetup and super.ngOnInit on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialDecisionFormSetupSpy = vi.spyOn<any, any>(component, 'initialDecisionFormSetup');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const superNgOnInitSpy = vi.spyOn<any, any>(
      Object.getPrototypeOf(FinesMacReviewAccountDecisionFormComponent.prototype),
      'ngOnInit',
    );

    component.ngOnInit();

    expect(initialDecisionFormSetupSpy).toHaveBeenCalled();
    expect(superNgOnInitSpy).toHaveBeenCalled();
  });
});
