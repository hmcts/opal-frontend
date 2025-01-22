import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ISignInStubForm } from './interfaces';
import { ChangeDetectorRef } from '@angular/core';
import { SsoEndpoints } from '@routing/enums/sso-endpoints';
import { GlobalStore } from 'src/app/stores/global/global.store';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalStore: any;
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

    globalStore = TestBed.inject(GlobalStore);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise', () => {
    component.ssoEnabled = true;

    expect(component.ssoEnabled).toBeTrue();

    globalStore.setSsoEnabled(false);

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
      mockDocumentLocation.location.href = SsoEndpoints.login;
    });
    component.handleSsoSignInButtonClick();
    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SsoEndpoints.login);
  });

  it('should handleStubSignInFormSubmit', () => {
    const formData: ISignInStubForm = { email: 'test' };
    const url = `${SsoEndpoints.login}?email=${formData.email}`;
    const spy = spyOn(component, 'handleStubSignInFormSubmit').and.callFake(() => {
      mockDocumentLocation.location.href = url;
    });
    component.handleStubSignInFormSubmit(formData);
    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(url);
  });
});
