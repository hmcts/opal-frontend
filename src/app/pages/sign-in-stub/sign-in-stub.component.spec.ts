import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInStubComponent } from './sign-in-stub.component';

describe('SignInStubComponent', () => {
  let component: SignInStubComponent;
  let fixture: ComponentFixture<SignInStubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInStubComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignInStubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
