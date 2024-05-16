import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';
import { ManualAccountCreationRoutes } from '@enums';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccountComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to account-details page on handleBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleBack();
    expect(routerSpy).toHaveBeenCalledWith([ManualAccountCreationRoutes.accountDetails]);
  });

  it('should navigate to the specified path on handleLinkNavigation', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    const path = 'some-path';
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleLinkNavigation(event, path);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith([path]);
  });
});
