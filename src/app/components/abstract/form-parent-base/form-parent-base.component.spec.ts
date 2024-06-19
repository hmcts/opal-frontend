import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormParentBaseComponent } from './form-parent-base.component';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingPaths } from '@enums';
import { of } from 'rxjs';

@Component({
  selector: 'app-test-form-parent-base',
  template: '',
})
class TestFormParentBaseComponent extends FormParentBaseComponent {
  constructor() {
    super();
  }
}

describe('FormParentBaseComponent', () => {
  let component: TestFormParentBaseComponent;
  let fixture: ComponentFixture<TestFormParentBaseComponent>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      parent: of({}), // Mocking the parent as an observable
    });

    TestBed.configureTestingModule({
      declarations: [TestFormParentBaseComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestFormParentBaseComponent);
    component = fixture.componentInstance;
  });

  it('should navigate to account-details page on handleBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component['routerNavigate']('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate to exit page if deactivateResult is false', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit(); // Ensure ngOnInit is called to set up the subscription
    component.deactivateResult.next(false);
    expect(routerSpy).toHaveBeenCalledWith([RoutingPaths.exitPage], { relativeTo: activatedRouteSpy.parent });
  });

  it('should not navigate to exit page if deactivateResult is true', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit(); // Ensure ngOnInit is called to set up the subscription
    component.deactivateResult.next(true);
    expect(routerSpy).not.toHaveBeenCalled();
  });

  it('should return true if stateUnsavedChanges is false and overrideExitPage is false', () => {
    component.stateUnsavedChanges = false;
    component['overrideExitPage'] = false;
    const result = component.canDeactivate();
    expect(result).toBeTrue();
  });
  
  it('should return false if stateUnsavedChanges is true and overrideExitPage is false', () => {
    component.stateUnsavedChanges = true;
    component['overrideExitPage'] = false;
    const result = component.canDeactivate();
    expect(result).toBeFalse();
  });
  
  it('should return true if stateUnsavedChanges is false and overrideExitPage is true', () => {
    component.stateUnsavedChanges = false;
    component['overrideExitPage'] = true;
    const result = component.canDeactivate();
    expect(result).toBeTrue();
  });
  
  it('should return true if stateUnsavedChanges is true and overrideExitPage is true', () => {
    component.stateUnsavedChanges = true;
    component['overrideExitPage'] = true;
    const result = component.canDeactivate();
    expect(result).toBeTrue();
  });
});
