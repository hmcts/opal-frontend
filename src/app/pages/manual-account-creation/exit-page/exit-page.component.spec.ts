import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExitPageComponent } from './exit-page.component';
import { Router } from '@angular/router';
import { MANUAL_ACCOUNT_CREATION_EXIT_ROUTES } from '@constants';
import { StateService } from '@services';

describe('ExitPageComponent', () => {
  let component: ExitPageComponent;
  let fixture: ComponentFixture<ExitPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let stateService: StateService;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }, StateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ExitPageComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct URL on handleOkClick', () => {
    component.finalUrl = 'test-url';
    const expectedPath = MANUAL_ACCOUNT_CREATION_EXIT_ROUTES[component.finalUrl];
    component.handleOkClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith([expectedPath], { replaceUrl: true });
  });

  it('should navigate to finalUrl on handleCancelClick', () => {
    component.finalUrl = 'test-url';
    component.handleCancelClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['test-url'], { replaceUrl: true });
  });

  it('should set finalUrl to the string representation of previousNavigation.finalUrl', () => {
    const routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
    routerSpy.getCurrentNavigation.and.returnValue({
      previousNavigation: {
        finalUrl: 'test-url',
      },
    });
    const component = new ExitPageComponent(routerSpy, stateService);
    expect(component.finalUrl).toEqual('test-url');
  });
});
