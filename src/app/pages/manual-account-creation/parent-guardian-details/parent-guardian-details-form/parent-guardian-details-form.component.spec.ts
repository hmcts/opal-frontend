import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentGuardianDetailsFormComponent } from './parent-guardian-details-form.component';
import { MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE_MOCK } from '@mocks';
import { MacStateService } from '@services';

describe('ParentGuardianDetailsFormComponent', () => {
  let component: ParentGuardianDetailsFormComponent;
  let fixture: ComponentFixture<ParentGuardianDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentGuardianDetailsFormComponent],
      providers: [MacStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentGuardianDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_PARENT_GUARDIAN_DETAILS_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });
});
