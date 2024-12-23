import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { ISignInStubForm } from './interfaces';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { ChangeDetectorRef } from '@angular/core';
import { SsoEndpoints } from '@routing/enums/sso-endpoints';

describe('SignInComponent', () => {
  let component: SignInComponent | null;
  let fixture: ComponentFixture<SignInComponent> | null;
  let globalStateService: GlobalStateService | null;
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

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise', () => {
    if (!component || !globalStateService || !fixture) {
      fail('Required properties not properly initialised');
      return;
    }

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
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const spy = spyOn(component, 'handleSsoSignInButtonClick');
    component.handleSsoSignInButtonClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should handleStubSignInFormSubmit', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const spy = spyOn(component, 'handleStubSignInFormSubmit');
    const mockFormData: ISignInStubForm = { email: 'test' };

    component.handleStubSignInFormSubmit(mockFormData);
    expect(spy).toHaveBeenCalledWith(mockFormData);
  });

  it('should handleSsoSignInButtonClick', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const spy = spyOn(component, 'handleSsoSignInButtonClick').and.callFake(() => {
      mockDocumentLocation.location.href = SsoEndpoints.login;
    });
    component.handleSsoSignInButtonClick();
    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SsoEndpoints.login);
  });

  it('should handleStubSignInFormSubmit', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

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
