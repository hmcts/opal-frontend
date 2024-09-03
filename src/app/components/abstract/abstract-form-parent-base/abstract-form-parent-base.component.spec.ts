import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbstractFormParentBaseComponent } from './abstract-form-parent-base.component';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

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
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
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
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should return true if any form value is truthy', () => {
    const form = {
      name: 'John Doe',
      age: 25,
      email: '',
    };
    const result = component['hasFormValues'](form);
    expect(result).toBe(true);
  });

  it('should return false if all form values are falsy', () => {
    const form = {
      name: '',
      age: 0,
      email: null,
    };
    const result = component['hasFormValues'](form);
    expect(result).toBe(false);
  });
});
