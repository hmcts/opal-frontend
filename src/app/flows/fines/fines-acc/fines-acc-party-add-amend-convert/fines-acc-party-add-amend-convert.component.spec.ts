import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FinesAccPartyAddAmendConvert } from './fines-acc-party-add-amend-convert.component';
import { MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA } from './mocks/fines-acc-party-add-amend-convert-form.mock';

describe('FinesAccPartyAddAmendConvert', () => {
  let component: FinesAccPartyAddAmendConvert;
  let fixture: ComponentFixture<FinesAccPartyAddAmendConvert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccPartyAddAmendConvert],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                debtorAmendFormData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA,
              },
              params: {
                partyType: 'individual',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccPartyAddAmendConvert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log form data when called', () => {
    // Arrange
    const mockFormData = {
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
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
      formData: MOCK_EMPTY_FINES_ACC_PARTY_ADD_AMEND_CONVERT_FORM_DATA.formData,
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
