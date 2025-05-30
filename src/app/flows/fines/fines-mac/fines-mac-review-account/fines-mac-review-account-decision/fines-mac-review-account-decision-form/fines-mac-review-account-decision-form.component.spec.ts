import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountDecisionFormComponent } from './fines-mac-review-account-decision-form.component';
import { IFinesMacReviewAccountDecisionForm } from '../interfaces/fines-mac-review-account-decision-form.interface';
import { FINES_MAC_REVIEW_ACCOUNT_DECISION_FORM_MOCK } from '../mocks/fines-mac-review-account-decision-form.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('FinesMacReviewAccountDecisionFormComponent', () => {
  let component: FinesMacReviewAccountDecisionFormComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountDecisionFormComponent>;
  let formSubmit: IFinesMacReviewAccountDecisionForm;

  beforeEach(async () => {
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

  it('should emit form submit event with form value', () => {
    const event = {} as SubmitEvent;
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

  it('should initialize the form with correct controls and validators', () => {
    expect(component.form.contains('fm_review_account_decision')).toBeTrue();
    expect(component.form.contains('fm_review_account_decision_reason')).toBeTrue();

    const decisionControl = component.form.get('fm_review_account_decision');
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');

    decisionControl?.setValue(null);
    expect(decisionControl?.valid).toBeFalse();
    decisionControl?.setValue('approve');
    expect(decisionControl?.valid).toBeTrue();

    rejectionReasonControl?.setValue('Some reason');
    expect(rejectionReasonControl?.valid).toBeTrue();
  });

  it('should add required validator to rejection reason when decision is reject', () => {
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');
    const decisionControl = component.form.get('fm_review_account_decision');

    decisionControl?.setValue('reject');
    fixture.detectChanges();

    rejectionReasonControl?.setValue('');
    rejectionReasonControl?.markAsTouched();
    expect(rejectionReasonControl?.hasError('required')).toBeTrue();

    rejectionReasonControl?.setValue('Valid reason');
    expect(rejectionReasonControl?.valid).toBeTrue();
  });

  it('should remove required validator from rejection reason when decision is not reject', () => {
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');
    const decisionControl = component.form.get('fm_review_account_decision');

    decisionControl?.setValue('reject');
    fixture.detectChanges();
    rejectionReasonControl?.setValue('');
    expect(rejectionReasonControl?.hasError('required')).toBeTrue();

    decisionControl?.setValue('approve');
    fixture.detectChanges();
    rejectionReasonControl?.setValue('');
    expect(rejectionReasonControl?.hasError('required')).toBeFalse();
  });

  it('should reset rejection reason control and update validity on decision change', () => {
    const rejectionReasonControl = component.form.get('fm_review_account_decision_reason');
    const decisionControl = component.form.get('fm_review_account_decision');

    rejectionReasonControl?.setValue('Some value');
    decisionControl?.setValue('reject');
    fixture.detectChanges();
    expect(rejectionReasonControl?.value).toBeNull();
    expect(rejectionReasonControl?.valid).toBeFalse();

    rejectionReasonControl?.setValue('Another value');
    decisionControl?.setValue('approve');
    fixture.detectChanges();
    expect(rejectionReasonControl?.value).toBeNull();
    expect(rejectionReasonControl?.valid).toBeTrue();
  });

  it('should call initialDecisionFormSetup and super.ngOnInit on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialDecisionFormSetupSpy = spyOn<any>(component, 'initialDecisionFormSetup').and.callThrough();
    const superNgOnInitSpy = spyOn(
      Object.getPrototypeOf(FinesMacReviewAccountDecisionFormComponent.prototype),
      'ngOnInit',
    ).and.callThrough();

    component.ngOnInit();

    expect(initialDecisionFormSetupSpy).toHaveBeenCalled();
    expect(superNgOnInitSpy).toHaveBeenCalled();
  });
});
