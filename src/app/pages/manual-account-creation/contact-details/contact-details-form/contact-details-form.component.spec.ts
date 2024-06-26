import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsFormComponent } from './contact-details-form.component';
import { MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE_MOCK } from '@mocks';

describe('ContactDetailsFormComponent', () => {
  let component: ContactDetailsFormComponent;
  let fixture: ComponentFixture<ContactDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form submit event with form value', () => {
    const formValue = MANUAL_ACCOUNT_CREATION_CONTACT_DETAILS_STATE_MOCK;
    spyOn(component['formSubmit'], 'emit');

    component['rePopulateForm'](formValue);

    component.handleFormSubmit();

    expect(component['formSubmit'].emit).toHaveBeenCalledWith(formValue);
  });
});
