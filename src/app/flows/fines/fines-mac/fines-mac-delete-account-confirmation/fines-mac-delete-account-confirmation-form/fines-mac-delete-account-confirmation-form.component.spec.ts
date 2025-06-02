
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FinesMacDeleteAccountConfirmationFormComponent } from './fines-mac-delete-account-confirmation-form.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

describe('FinesMacDeleteAccountConfirmationFormComponent', () => {
  let component: FinesMacDeleteAccountConfirmationFormComponent;
  let fixture: ComponentFixture<FinesMacDeleteAccountConfirmationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, FinesMacDeleteAccountConfirmationFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacDeleteAccountConfirmationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the reason textarea', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeTruthy();
  });

  it('should be invalid if reason is empty', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('');
    expect(component.form.invalid).toBeTrue();
  });

  it('should be valid if reason is provided', () => {
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('Some reason');
    expect(component.form.valid).toBeTrue();
  });

  it('should show error if reason exceeds max length', () => {
    const longText = 'a'.repeat(251);
    component.form.controls['fm_delete_account_confirmation_reason'].setValue(longText);
    expect(component.form.invalid).toBeTrue();
  });

  it('should emit form submit event when form is valid and submitted', () => {
    spyOn(component['formSubmit'], 'emit');
    component.form.controls['fm_delete_account_confirmation_reason'].setValue('Valid reason');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', { preventDefault: () => {} });

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(jasmine.objectContaining({
      formData: jasmine.objectContaining({
        fm_delete_account_confirmation_reason: 'Valid reason'
      })
    }));
  });
});