import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ISignInStubForm } from './interfaces';
import { SSO_ENDPOINTS } from '@routing/constants/sso-endpoints.constant';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handleStubSignInFormSubmit', () => {
    const spy = spyOn(component, 'handleStubSignInFormSubmit');
    const mockFormData: ISignInStubForm = { email: 'test' };

    component.handleStubSignInFormSubmit(mockFormData);
    expect(spy).toHaveBeenCalledWith(mockFormData);
  });

  it('should handleStubSignInFormSubmit', () => {
    const formData: ISignInStubForm = { email: 'test' };
    const url = `${SSO_ENDPOINTS.login}?email=${formData.email}`;
    const spy = spyOn(component, 'handleStubSignInFormSubmit').and.callFake(() => {
      mockDocumentLocation.location.href = url;
    });
    component.handleStubSignInFormSubmit(formData);
    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(url);
  });
});
