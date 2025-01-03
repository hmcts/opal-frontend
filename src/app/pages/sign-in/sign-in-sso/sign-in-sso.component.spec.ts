import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInSsoComponent } from './sign-in-sso.component';

describe('SignInSsoComponent', () => {
  let component: SignInSsoComponent | null;
  let fixture: ComponentFixture<SignInSsoComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInSsoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInSsoComponent);
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

  it('should emit signInButtonClick event when handleButtonClick is called', () => {
    if (!component) {
      fail('Required properties not properly initialised');
      return;
    }

    const emitSpy = spyOn(component['signInButtonClick'], 'emit');

    component.handleButtonClick();

    expect(emitSpy).toHaveBeenCalled();
  });
});
