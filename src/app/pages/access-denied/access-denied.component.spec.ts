import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessDeniedComponent } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to / on go back button click', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.handleGoBackButtonClick();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });
});
