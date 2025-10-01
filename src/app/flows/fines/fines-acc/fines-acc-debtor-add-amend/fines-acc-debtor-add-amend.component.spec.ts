import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FinesAccDebtorAddAmend } from './fines-acc-debtor-add-amend.component';
import { MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA } from './mocks/fines-acc-debtor-add-amend-form.mock';

describe('FinesAccDebtorAddAmend', () => {
  let component: FinesAccDebtorAddAmend;
  let fixture: ComponentFixture<FinesAccDebtorAddAmend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccDebtorAddAmend],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                debtorAmendFormData: MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA,
              },
              params: {
                partyType: 'individual',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDebtorAddAmend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log form data when called', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA.formData,
      nestedFlow: false,
    };
    const consoleSpy = spyOn(console, 'log');

    // Act
    component.handleFormSubmit(mockFormData);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted with data:', mockFormData);
  });

  it('should handle form submission without throwing errors', () => {
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_DEBTOR_ADD_AMEND_FORM_DATA.formData,
      nestedFlow: true,
    };
    expect(() => component.handleFormSubmit(mockFormData)).not.toThrow();
  });

  it('should set stateUnsavedChanges to true when called with true', () => {
    component.handleUnsavedChanges(true);
    expect(component.stateUnsavedChanges).toBe(true);
  });

  it('should set stateUnsavedChanges to false when called with false', () => {
    component.stateUnsavedChanges = true;
    component.handleUnsavedChanges(false);
    expect(component.stateUnsavedChanges).toBe(false);
  });
});
