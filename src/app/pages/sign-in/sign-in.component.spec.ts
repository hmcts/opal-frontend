import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ISignInStubForm } from './interfaces';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { ChangeDetectorRef } from '@angular/core';
import { SSO_ENDPOINTS } from '@routing/constants/sso-endpoints.constant';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let globalStateService: GlobalStateService;
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [],
    }).compileComponents();

    globalStateService = TestBed.inject(GlobalStateService);

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise', () => {
    component.ssoEnabled = true;

    expect(component.ssoEnabled).toBeTrue();

    globalStateService.ssoEnabled = false;

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    const detectChangesSpy = spyOn(cdr.constructor.prototype, 'detectChanges');

    component.ngOnInit();
    expect(component.ssoEnabled).toBeFalse();
    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('should handleSsoSignInButtonClick', () => {
    const spy = spyOn(component, 'handleSsoSignInButtonClick');
    component.handleSsoSignInButtonClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should handleStubSignInFormSubmit', () => {
    const spy = spyOn(component, 'handleStubSignInFormSubmit');
    const mockFormData: ISignInStubForm = { email: 'test' };

    component.handleStubSignInFormSubmit(mockFormData);
    expect(spy).toHaveBeenCalledWith(mockFormData);
  });

  it('should handleSsoSignInButtonClick', () => {
    const spy = spyOn(component, 'handleSsoSignInButtonClick').and.callFake(() => {
      mockDocumentLocation.location.href = SSO_ENDPOINTS.login;
    });
    component.handleSsoSignInButtonClick();
    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SSO_ENDPOINTS.login);
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
