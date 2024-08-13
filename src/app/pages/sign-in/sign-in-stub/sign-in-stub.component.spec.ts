import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInStubComponent } from './sign-in-stub.component';
import { SIGN_IN_STUB_FORM_MOCK } from '../mocks';

describe('SignInStubComponent', () => {
  let component: SignInStubComponent;
  let fixture: ComponentFixture<SignInStubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInStubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInStubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setupSignInForm on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupSignInForm');
    component.ngOnInit();
    expect(component['setupSignInForm']).toHaveBeenCalled();
  });

  it('should initialize signInForm with email FormControl', () => {
    component['setupSignInForm']();
    expect(component.signInForm.get('email')).toBeTruthy();
  });

  it('should require email field to be filled', () => {
    component['setupSignInForm']();
    const emailControl = component.signInForm.get('email');
    emailControl?.setValue(null);
    expect(emailControl?.valid).toBeFalsy();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });
  it('should emit signInForm value on form submit when form is valid', () => {
    spyOn(component['signInFormSubmit'], 'emit');
    component.signInForm.setValue(SIGN_IN_STUB_FORM_MOCK);
    component.handleFormSubmit();
    expect(component['signInFormSubmit'].emit).toHaveBeenCalledWith(SIGN_IN_STUB_FORM_MOCK);
  });

  it('should not emit signInForm value on form submit when form is invalid', () => {
    spyOn(component['signInFormSubmit'], 'emit');
    component.signInForm.setValue({
      email: null,
    });
    component.handleFormSubmit();
    expect(component['signInFormSubmit'].emit).not.toHaveBeenCalled();
  });
});
