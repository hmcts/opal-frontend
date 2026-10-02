import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FinesMacDeleteAccountConfirmationFormComponent } from './fines-mac-delete-account-confirmation-form.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesMacDeleteAccountConfirmationFormComponent', () => {
  let component: FinesMacDeleteAccountConfirmationFormComponent;
  let fixture: ComponentFixture<FinesMacDeleteAccountConfirmationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, FinesMacDeleteAccountConfirmationFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationFormComponent);
    component = fixture.componentInstance;
    component.accountId = 123;
    fixture.detectChanges();
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
  });

  it('should not initialise form state when there is no accountId on init', () => {
    const freshFixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationFormComponent);
    const freshComponent = freshFixture.componentInstance;
    freshComponent.accountId = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialSetupSpy = vi.spyOn<any, any>(freshComponent, 'initialDeleteAccountConfirmationSetup');

    freshComponent.ngOnInit();

    expect(initialSetupSpy).not.toHaveBeenCalled();
  });

  it('should render the reason textarea', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeTruthy();
  });

  it('should be invalid if reason is empty', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('');
    expect(component.form.invalid).toBe(true);
  });

  it('should be valid if reason is provided', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('Some reason');
    expect(component.form.valid).toBe(true);
  });

  it('should be valid if reason includes allowed punctuation', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue("Reason-1, it's valid.");
    expect(component.form.valid).toBe(true);
  });

  it('should be invalid if reason includes unsupported special characters', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('Reason @ invalid');
    expect(component.form.controls['fm_delete_account_confirmation_reason'].hasError('alphanumericTextPattern')).toBe(
      true,
    );
  });

  it('should emit form submit event when form is valid and submitted', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['formSubmit'], 'emit');
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('Valid reason');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', { preventDefault: () => {} });

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: expect.objectContaining({
          fm_delete_account_confirmation_reason: 'Valid reason',
        }),
      }),
    );
  });

  it('should handleFormSubmit method correctly when there is no accountId', () => {
    component.accountId = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.finesMacStore, 'resetStore');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component, 'handleRoute');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitEvent: any = {
      preventDefault: () => {},
      submitter: null,
    } as SubmitEvent;

    component.handleFormSubmit(submitEvent);

    expect(component.handleRoute).toHaveBeenCalled();
  });

  it('should handleRoute method correctly when there is no accountId', () => {
    component.accountId = null;
    const route = 'createAccount';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'], 'navigate');

    component.handleRoute(route);

    expect(component['router'].navigate).toHaveBeenCalled();
  });

  it('should handleRoute method correctly when there is an accountId', () => {
    component.accountId = 123;
    const route = 'createAccount';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'], 'navigate');

    component.handleRoute(route);

    expect(component['router'].navigate).toHaveBeenCalled();
  });

  it('should route back to account details with the accountId when the referrer is account details', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'], 'navigate');
    component.referrer = component['fineMacRoutingPaths'].children.accountDetails;
    component.accountId = 123;

    component.handleRoute(component.referrer);

    expect(component['router'].navigate).toHaveBeenCalledWith(
      [component['fineMacRoutingPaths'].children.accountDetails + '/123'],
      { relativeTo: component['activatedRoute'].parent },
    );
  });

  it('should route back to check account without an accountId when the referrer is check account', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'], 'navigate');
    component.referrer = component['fineMacRoutingPaths'].children.reviewAccount;
    component.accountId = null;

    component.handleRoute(component.referrer);

    expect(component['router'].navigate).toHaveBeenCalledWith(
      [component['fineMacRoutingPaths'].children.reviewAccount],
      { relativeTo: component['activatedRoute'].parent },
    );
  });

  it('should route back to check account with the accountId when the referrer is check account', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['router'], 'navigate');
    component.referrer = component['fineMacRoutingPaths'].children.reviewAccount;
    component.accountId = 123;

    component.handleRoute(component.referrer);

    expect(component['router'].navigate).toHaveBeenCalledWith(
      [component['fineMacRoutingPaths'].children.reviewAccount + '/123'],
      { relativeTo: component['activatedRoute'].parent },
    );
  });

  it.each([
    {
      description: 'form is dirty, reason has value, and form is not submitted',
      reason: 'Valid reason',
      isDirty: true,
      isSubmitted: false,
      expectedHasUnsavedChanges: true,
    },
    {
      description: 'form is pristine',
      reason: 'Valid reason',
      isDirty: false,
      isSubmitted: false,
      expectedHasUnsavedChanges: false,
    },
    {
      description: 'reason is empty',
      reason: '',
      isDirty: true,
      isSubmitted: false,
      expectedHasUnsavedChanges: false,
    },
  ])(
    'should return $expectedHasUnsavedChanges from hasUnsavedChanges if $description',
    ({ reason, isDirty, isSubmitted, expectedHasUnsavedChanges }) => {
      component.form.controls['fm_delete_account_confirmation_reason'].setValue(reason);
      if (isDirty) {
        component.form.markAsDirty();
      } else {
        component.form.markAsPristine();
      }
      component['formSubmitted'] = isSubmitted;

      expect(component['hasUnsavedChanges']()).toBe(expectedHasUnsavedChanges);
    },
  );

  it('should return false from hasUnsavedChanges if form is submitted', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('Some reason');
    component.form.markAsDirty();
    component['formSubmitted'] = true;

    expect(component['hasUnsavedChanges']()).toBe(false);
  });
});
