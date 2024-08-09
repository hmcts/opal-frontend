import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbstractFormParentBaseComponent } from './abstract-form-parent-base.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-form-parent-base',
  template: '',
})
class TestAbstractFormParentBaseComponent extends AbstractFormParentBaseComponent {
  constructor() {
    super();
  }
}

describe('AbstractFormParentBaseComponent', () => {
  let component: TestAbstractFormParentBaseComponent;
  let fixture: ComponentFixture<TestAbstractFormParentBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestAbstractFormParentBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAbstractFormParentBaseComponent);
    component = fixture.componentInstance;
  });

  it('should return false if there are unsaved changes', () => {
    component.stateUnsavedChanges = true;
    expect(component.canDeactivate()).toBe(false);
  });

  it('should return true if there are no unsaved changes', () => {
    component.stateUnsavedChanges = false;
    expect(component.canDeactivate()).toBe(true);
  });

  it('should navigate to account-details page on handleBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component['routerNavigate']('test');
    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });
});
