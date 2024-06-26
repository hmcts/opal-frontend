import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormParentBaseComponent } from './form-parent-base.component';
import { Component } from '@angular/core';
import { MacStateService } from '@services';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFormParentBaseComponent],
      providers: [MacStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestFormParentBaseComponent);
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
