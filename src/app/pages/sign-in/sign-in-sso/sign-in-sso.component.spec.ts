import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInSsoComponent } from './sign-in-sso.component';

describe('SignInSsoComponent', () => {
  let component: SignInSsoComponent;
  let fixture: ComponentFixture<SignInSsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInSsoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit signInButtonClick event when handleButtonClick is called', () => {
    const emitSpy = spyOn(component['signInButtonClick'], 'emit');

    component.handleButtonClick();

    expect(emitSpy).toHaveBeenCalled();
  });
});
