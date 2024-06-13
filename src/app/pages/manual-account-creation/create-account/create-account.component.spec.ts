import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountComponent } from './create-account.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateAccountComponent', () => {
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

  it('should navigate to account-details page on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleRoute('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });
});
